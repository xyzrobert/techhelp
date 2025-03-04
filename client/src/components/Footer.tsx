
import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-4 bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="font-bold text-xl mb-2">Klarfix</div>
        <div className="text-muted-foreground text-center">
          "Wieso funktionierts nicht - i woas des"
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} Klarfix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
