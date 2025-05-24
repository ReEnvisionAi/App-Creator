@@ .. @@
 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
-import { supabase } from '../../../lib/supabase';
-import { Button } from "../../../components/ui/button";
-import { Input } from "../../../components/ui/input";
-import { Label } from "../../../components/ui/label";
-import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
+import { supabase } from '@/lib/supabase';
+import { Button } from "@/components/ui/button";
+import { Input } from "@/components/ui/input";
+import { Label } from "@/components/ui/label";
+import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 
 export default function LoginPage() {