"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, FileText, Database, Shield, Monitor } from 'lucide-react';

export default function APIDocs() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if user is on desktop
    const checkDesktop = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsDesktop(!isMobile);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Show mobile message if not desktop
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Monitor className="w-12 h-12 mx-auto text-[#0071E3] mb-4" />
            <CardTitle>Desktop Only</CardTitle>
            <CardDescription>
              API documentation is only accessible on desktop devices for the best viewing experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-[#6E6E73]">
              Please switch to a desktop or laptop computer to access the API documentation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3] text-sm font-medium mb-6">
            <Database className="w-4 h-4" />
            API Documentation
          </div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] tracking-tight mb-4">
            BSEB Result API
          </h1>
          <p className="text-lg text-[#6E6E73] max-w-2xl mx-auto leading-relaxed">
            Complete API documentation for the Bihar Board Result Portal. Learn how to integrate with our services.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  API Overview
                </CardTitle>
                <CardDescription>
                  The BSEB Result API provides programmatic access to Bihar Board examination results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                  <pre className="block bg-gray-100 p-3 rounded-lg">
                    <code>https://your-domain.com/api</code>
                  </pre>
                  <p className="text-sm text-[#6E6E73] mt-2">Live API: <code>https://resultapi.biharboardonline.org/result</code></p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
                  <p className="text-[#6E6E73]">100 requests per minute per IP address</p>
                </div>
                <div>
                  <h3 className="text font-semibold mb-2">Data Format</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">JSON</Badge>
                    <Badge variant="secondary">UTF-8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  No authentication required for result fetching. Anonymous users supported.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Headers</h3>
                  <p className="text-[#6E6E73] mb-2">Required headers for API access. Mobile user agent recommended for compatibility.</p>
                  <pre className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                    <code>{`GET /api/result?roll_code=12345&roll_no=1234567
Host: your-domain.com
User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36
accept: application/json, text/plain, */*
accept-encoding: gzip, deflate, br, zstd
accept-language: en-GB,en-US;q=0.9,en;q=0.8
origin: https://result.biharboardonline.org
referer: https://result.biharboardonline.org/
sec-ch-ua: "Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"
sec-ch-ua-mobile: ?1
sec-ch-ua-platform: "Android"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-site`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Firebase Integration</h3>
                  <p className="text-[#6E6E73]">
                    The app uses Firebase Realtime Database for storing user history and shared results. 
                    Anonymous authentication is automatically handled.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available API endpoints for fetching BSEB results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-[#0071E3] pl-4">
                  <h3 className="font-semibold text-lg mb-2">GET /api/result</h3>
                  <p className="text-[#6E6E73] mb-2">Fetch Bihar Board examination result.</p>
                  <div className="space-y-2">
                    <div>
                      <Badge className="mb-2">Parameters</Badge>
                      <ul className="space-y-1 text-sm">
                        <li><code>roll_code</code> (required) - Roll Code of the school</li>
                        <li><code>roll_no</code> (required) - Roll Number of the student</li>
                      </ul>
                    </div>
                    <div>
                      <Badge className="mb-2">Example Request</Badge>
                      <pre className="block bg-gray-100 p-3 rounded-lg text-sm">
                        <code>{`GET /api/result?roll_code=12345&roll_no=1234567`}</code>
                      </pre>
                    </div>
                    <div>
                      <Badge className="mb-2">Response</Badge>
                      <pre className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`{
  "success": true,
  "data": {
    "reg_no": "12345-00123-25",
    "roll_code": "12345",
    "roll_no": "1234567",
    "school_name": "DEMO HIGH SCHOOL, PATNA",
    "total": "425",
    "division": "1st Division",
    "is_topper": false,
    "name": "STUDENT NAME",
    "father_name": "FATHER NAME",
    "passed_under_regulation": null,
    "is_improved_result": null,
    "exam_type": "REGULAR",
    "is_expelled": null,
    "division_grace_marks": null,
    "subjects": [
      {
        "sub_code": "101",
        "sub_name": "HINDI",
        "theory": "080",
        "project_work": null,
        "ia_sci": null,
        "practical": null,
        "literacy_activity": null,
        "regulation": null,
        "cce": null,
        "sub_group_id": "1",
        "is_compartmental": null,
        "sub_total": "080",
        "sub_result": null,
        "is_improved_sub": null
      },
      {
        "sub_code": "102",
        "sub_name": "ENGLISH",
        "theory": "085",
        "project_work": null,
        "ia_sci": null,
        "practical": null,
        "literacy_activity": null,
        "regulation": null,
        "cce": null,
        "sub_group_id": "2",
        "is_compartmental": null,
        "sub_total": "085",
        "sub_result": null,
        "is_improved_sub": null
      }
    ]
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Code Examples
                </CardTitle>
                <CardDescription>
                  Sample code for integrating with the BSEB Result API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">JavaScript/TypeScript</h3>
                  <pre className="block bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                    <code>{`async function fetchResult(rollCode, rollNo) {
  try {
    const response = await fetch(
      \`/api/result?roll_code=\${rollCode}&roll_no=\${rollNo}\`
    );
    const data = await response.json();
    
    if (data.success) {
      console.log('Student Result:', data.data);
      console.log('Name:', data.data.name);
      console.log('Division:', data.data.division);
      console.log('Total Marks:', data.data.total);
      return data.data;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Usage with working example
const result = await fetchResult('12345', '1234567');
if (result) {
  console.log(\`Result for \${result.name} (\${result.roll_no})\`);
}`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">cURL</h3>
                  <pre className="block bg-gray-100 p-3 rounded-lg text-sm">
                    <code>{`curl -X GET \\
  "https://your-domain.com/api/result?roll_code=12345&roll_no=1234567" \\
  -H "accept: application/json, text/plain, */*" \\
  -H "User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36" \\
  -H "origin: https://result.biharboardonline.org" \\
  -H "referer: https://result.biharboardonline.org/"`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  Common error responses and their meanings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-700">400 Bad Request</h4>
                    <p className="text-gray-600">Missing or invalid parameters.</p>
                    <pre className="block bg-red-50 p-2 rounded text-sm">
                      <code>{`{"success": false, "error": "Missing Roll Code or Roll Number"}`}</code>
                    </pre>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700">404 Not Found</h4>
                    <p className="text-gray-600">Result not found for provided roll details.</p>
                    <pre className="block bg-yellow-50 p-2 rounded text-sm">
                      <code>{`{"success": false, "error": "Result not found"}`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Firebase Tab */}
          <TabsContent value="firebase" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Firebase Integration
                </CardTitle>
                <CardDescription>
                  Firebase Realtime Database configuration and usage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Database Structure</h3>
                  <pre className="block bg-gray-100 p-3 rounded-lg text-sm">
                    <code>{`{
  "users": {
    "{userId}": {
      "results": {},
      "history": {},
      "shared": {},
      "preferences": {}
    }
  },
  "shared": {}
}`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Firebase Rules</h3>
                  <p className="text-[#6E6E73] mb-2">Users can only access their own data. Shared results are readable by all authenticated users.</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Anonymous Auth</Badge>
                    <Badge variant="outline">Real-time Sync</Badge>
                    <Badge variant="outline">Automatic Backup</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Attribution */}
      <div className="text-center py-8 border-t border-[#E5E5EA] mt-12">
        <p className="text-sm text-[#6E6E73]">
          Designed and Developed by Satyam €Rojha
        </p>
      </div>
    </div>
  );
}
