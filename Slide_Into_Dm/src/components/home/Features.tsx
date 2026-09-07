import { Brain, Cloud, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "Automated Outreach",
    description: "Automate client outreach with targeted messaging based on keywords or AI-driven triggers.",
    icon: Brain,
  },
  {
    name: "AI-Powered Conversations",
    description: "Let AI take over conversations on auto-pilot, offering seamless support and engagement.",
    icon: Cloud,
  },
  {
    name: "Secure Messaging",
    description: "Ensure secure and private interactions with encrypted direct messages and data privacy.",
    icon: Shield,
  },
  {
    name: "Fast Automation",
    description: "Fire automations instantly, reaching thousands of clients within seconds for maximum impact.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Key Features</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Slide helps you engage, convert, and support your customers effortlessly with automation and AI.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
