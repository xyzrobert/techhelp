
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          klar, fix!
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Technische Hilfe von vertrauenswürdigen Helfern in Ihrer Nähe
        </p>
        <Link href="/search">
          <Button size="lg" className="text-xl py-6 px-12 rounded-full bg-primary hover:bg-primary/90 transition-all">
            Hilfe finden
          </Button>
        </Link>
      </div>

      {/* Service Categories */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Unsere Dienstleistungen</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard 
            title="Computer & Internet" 
            description="PC-Probleme, WLAN-Einrichtung, Software-Installation und mehr"
            icon="💻"
            href="/search?category=computer"
          />
          <ServiceCard 
            title="Smartphone & Tablet" 
            description="App-Installation, Datenübertragung, Fehlerbehebung und Einrichtung"
            icon="📱"
            href="/search?category=smartphone"
          />
          <ServiceCard 
            title="Smart Home" 
            description="Einrichtung von smarten Geräten, Sprachassistenten und Vernetzung"
            icon="🏠"
            href="/search?category=smarthome"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full max-w-4xl mx-auto bg-secondary/20 rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">So funktioniert's</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Problem beschreiben</h3>
            <p className="text-muted-foreground">Wählen Sie die Kategorie und beschreiben Sie Ihr technisches Problem</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Helfer auswählen</h3>
            <p className="text-muted-foreground">Wählen Sie einen verfügbaren Helfer in Ihrer Nähe aus</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Hilfe erhalten</h3>
            <p className="text-muted-foreground">Erhalten Sie schnelle und kompetente Unterstützung bei Ihrem Problem</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Das sagen unsere Kunden</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestimonialCard 
            quote="Ich bin so froh, dass ich klar, fix! gefunden habe. Mein WLAN-Problem wurde innerhalb einer Stunde gelöst!"
            author="Maria S., 68 Jahre"
          />
          <TestimonialCard 
            quote="Der junge Mann war sehr geduldig und hat mir alles genau erklärt. Jetzt kann ich endlich mit meinen Enkeln videotelefonieren."
            author="Hans W., 72 Jahre"
          />
        </div>
      </div>

      <Separator className="w-full max-w-4xl mx-auto mb-8" />

      <div className="text-center mb-8">
        <p className="text-muted-foreground">Technische Hilfe war noch nie so einfach.</p>
        <Link href="/search">
          <Button variant="outline" className="mt-4">
            Jetzt technische Hilfe finden
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ServiceCard({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer hover:shadow-md transition-all duration-300 border-2 hover:border-primary">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="text-3xl text-primary mb-4">"</div>
        <p className="italic mb-4">{quote}</p>
        <p className="text-right font-semibold">— {author}</p>
      </CardContent>
    </Card>
  );
}
