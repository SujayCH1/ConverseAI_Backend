// src/app/api/proxyBusiness/route.ts
import { NextResponse } from "next/server";
import { client } from '@/lib/prisma'
import { userFormStatus } from "@/actions/user";
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Convert the formData to a regular object
    const business_name = formData.get("business_name");
    const business_info = formData.get("business_info");
 
    console.log("business_name:", business_name, "business_info:", business_info);
 
    const payload = {
      business_name,
      business_info,
    }; 
    const response = await fetch("https://malta-bryan-lying-guarantee.trycloudflare.com/create_business/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify(payload),
    }); 
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      console.log("data from line 28",data)
      if(data.status === 'success'){
        await userFormStatus()
      }
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.log("text",text)
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Error forwarding to external API:", error);
    return NextResponse.json(
      { message: "Failed to reach external API" },
      { status: 500 }
    );
  }
} 
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
