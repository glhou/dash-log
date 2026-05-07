import { Card, CardHeader, CardTitle } from "../components/ui/card"

export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4"> Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>PIE</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KEYWORD FREQUENCE</CardTitle>
          </CardHeader>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>ALERT LOGS</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
