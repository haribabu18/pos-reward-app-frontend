import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { z } from "zod"
import { Title } from "@radix-ui/react-dialog"
import { title } from "process"

export const products = z.object({
  id : z.number(),
  name: z.string(),
  sold: z.string(),
  stock: z.string(),
})

export const schema = z.object({
  id : z.number(),
  title: z.string(),
  value: z.string(),
  trend: z.string(),
  percent: z.string(),
})

export function SectionCards({
  data: initialData, 
  products: produts,
}: {
  data: z.infer<typeof schema>[]
  products: z.infer<typeof products>[]
})  {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {initialData.map((item) => (
      <Card key={item.id} className="@container/card">
        <CardHeader>
          <CardDescription>{item.title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {item.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {item.trend === "up" ? <><IconTrendingUp />+</> : <><IconTrendingDown />-</> }
              {item.percent}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      ))}
    </div>
  )
}
