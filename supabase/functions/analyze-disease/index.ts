import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalyzeRequest {
  imageBase64: string;
  cropName: string;
  symptoms: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, cropName, symptoms }: AnalyzeRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    console.log(`Analyzing disease for crop: ${cropName}, symptoms: ${symptoms.join(", ")}`);

    const systemPrompt = `You are an expert agricultural pathologist AI assistant specialized in crop disease identification. 
Your task is to analyze crop images and symptoms to diagnose plant diseases accurately.

When analyzing, consider:
1. Visual symptoms visible in the image (discoloration, spots, wilting, lesions, mold, etc.)
2. The reported symptoms from the farmer
3. Common diseases affecting the specific crop type
4. Seasonal and environmental factors

Provide your diagnosis in a structured JSON format with the following fields:
- diseaseName: The identified disease name
- confidence: A percentage (0-100) indicating your confidence level
- severity: "low", "medium", or "high"
- description: A brief description of the disease (2-3 sentences)
- symptoms: Array of symptoms that match this disease
- prevention: Array of 3-4 prevention measures
- treatment: Array of 3-4 treatment recommendations
- additionalNotes: Any important additional information for the farmer

Be accurate but also helpful. If you cannot identify a specific disease, suggest the most likely possibilities based on the symptoms.`;

    const userPrompt = `Please analyze this ${cropName} plant image for diseases.

The farmer has reported the following symptoms:
${symptoms.length > 0 ? symptoms.map(s => `- ${s.replace(/_/g, " ")}`).join("\n") : "- No specific symptoms reported"}

Analyze the image and provide a detailed diagnosis in JSON format.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          ...(imageBase64 ? [{
            type: "image_url",
            image_url: {
              url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
            }
          }] : [])
        ]
      }
    ];

    console.log("Sending request to Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log("AI Response received:", content?.substring(0, 200));

    // Parse the JSON response from the AI
    let diagnosis;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      diagnosis = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Provide a fallback structured response
      diagnosis = {
        diseaseName: "Analysis Inconclusive",
        confidence: 50,
        severity: "medium",
        description: "The AI was unable to provide a structured diagnosis. Please consult with a local agricultural expert.",
        symptoms: symptoms,
        prevention: [
          "Maintain proper plant spacing for air circulation",
          "Use disease-resistant varieties when possible",
          "Practice crop rotation",
          "Remove infected plant material promptly"
        ],
        treatment: [
          "Monitor the plant closely for changes",
          "Consult with a local agricultural extension service",
          "Consider sending samples to a plant pathology lab",
          "Apply appropriate organic or chemical treatments as recommended"
        ],
        additionalNotes: content || "Unable to analyze the image. Please try again with a clearer photo."
      };
    }

    console.log("Diagnosis complete:", diagnosis.diseaseName);

    return new Response(JSON.stringify(diagnosis), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-disease function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
