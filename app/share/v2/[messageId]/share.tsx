@@ .. @@
 "use client";
 
 import ShareIcon from "@/components/icons/share-icon";
-import { toast } from "@/hooks/use-toast";
+import { useNotification } from "@/components/notification/use-notification";
 import { Message } from "@prisma/client";
 
 export function Share({ message }: { message?: Message }) {
+  const { notify } = useNotification();
+
   async function shareAction() {
     if (!message) return;
 
     const baseUrl = window.location.href;
     const shareUrl = new URL(`/share/v2/${message.id}`, baseUrl);
 
-    toast({
+    notify({
       title: "App Published!",
       description: `App URL copied to clipboard: ${shareUrl.href}`,
-      variant: "default",
+      type: "success",
     });
 
     await navigator.clipboard.writeText(shareUrl.href);
   }