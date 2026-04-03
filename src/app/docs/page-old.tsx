import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, FileText, Database, Users, Shield, Key } from 'lucide-react';

export default function APIDocs() {
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
                  <p className="text-[#6E6E73] mb-2">No special headers required for basic usage.</p>
                  <pre className="block bg-gray-100 p-3 rounded-lg text-sm">
                    {`GET /api/result?roll_code=26075&roll_no=2600013
Host: your-domain.com
User-Agent: Mozilla/5.0`}
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
                        <li><pre>>roll_code</Code> (required) - Roll Code of the school</li>
                        <li><pre>>roll_no</Code> (required) - Roll Number of the student</li>
                      </ul>
                    </div>
                    <div>
                      <Badge className="mb-2">Example Request</Badge>
                      <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                        {`GET /api/result?roll_code=26075&roll_no=2600013`}
                      </Code>
                    </div>
                    <div>
                      <Badge className="mb-2">Response</Badge>
                      <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                        {`{
  "success": true,
  "data": {
    "reg_no": "BSEB2600013",
    "roll_code": "26075",
    "roll_no": "2600013",
    "name": "Student Name",
    "father_name": "Father Name",
    "school_name": "School Name",
    "total": "425",
    "division": "1st",
    "subjects": [...]
  }
}`}
                      </Code>
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
                  <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                    {`async function fetchResult(rollCode, rollNo) {
  try {
    const response = await fetch(
      \`/api/result?roll_code=\${rollCode}&roll_no=\${rollNo}\`
    );
    const data = await response.json();
    
    if (data.success) {
      console.log('Result:', data.data);
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

// Usage
const result = await fetchResult('26075', '2600013');`}
                  </Code>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Python</h3>
                  <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                    {`import requests

def fetch_result(roll_code, roll_no):
    try:
        response = requests.get(
            f'/api/result?roll_code={roll_code}&roll_no={roll_no}'
        )
        data = response.json()
        
        if data['success']:
            return data['data']
        else:
            print(f"Error: {data['error']}")
            return None
    except Exception as e:
        print(f"Network error: {e}")
        return None

# Usage
result = fetch_result('26075', '2600013')`}
                  </Code>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">cURL</h3>
                  <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                    {`curl -X GET \\
  "https://your-domain.com/api/result?roll_code=26075&roll_no=2600013" \\
  -H "Content-Type: application/json"`}
                  </Code>
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
                    <pre> className="block bg-red-50 p-2 rounded text-sm">
                      {`{"success": false, "error": "Missing Roll Code or Roll Number"}`}
                    </Code>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700">404 Not Found</h4>
                    <p className="text-gray-600">Result not found for provided roll details.</p>
                    <pre> className="block bg-yellow-50 p-2 rounded text-sm">
                      {`{"success": false, "error": "Result not found"}`}
                    </Code>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-700">500 Server Error</h4>
                    <p className="text-gray-600">Internal server error.</p>
                    <pre> className="block bg-red-50 p-2 rounded text-sm">
                      {`{"success": false, "error": "Internal server error"}`}
                    </Code>
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
                  <pre> className="block bg-gray-100 p-3 rounded-lg text-sm">
                    {`{
  "users": {
    "{userId}": {
      "results": {},
      "history": {},
      "shared": {},
      "preferences": {}
    }
  },
  "shared": {}
}`}
                  </Code>
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
    </div>
  );
}
