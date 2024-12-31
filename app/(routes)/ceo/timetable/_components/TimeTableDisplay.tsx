import { format, startOfWeek, addDays } from 'date-fns'
import { TimetableEntry } from '@/actions/timeTableActions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TimetableDisplayProps {
  timetable: TimetableEntry[]
}

export function TimetableDisplay({ timetable }: TimetableDisplayProps) {
  const weekStart = startOfWeek(new Date(timetable[0].date), { weekStartsOn: 1 })
  const weeks: TimetableEntry[][] = []

  for (let i = 0; i < 4; i++) {
    const weekEntries = timetable.filter(entry =>
      new Date(entry.date) >= addDays(weekStart, i * 7) &&
      new Date(entry.date) < addDays(weekStart, (i + 1) * 7)
    )
    weeks.push(weekEntries)
  }

  return (
    <div className="space-y-8">
      {weeks.map((week, weekIndex) => {
        // Use a fallback date if the week is empty
        const defaultDate = addDays(weekStart, weekIndex * 7)

        return (
          <Card key={weekIndex}>
            <CardHeader>
              <CardTitle>Week {weekIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Morning Shift (9AM - 5PM)</TableHead>
                    <TableHead>Evening Shift (6PM - 1AM)</TableHead>
                    <TableHead>Off</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                    const date = week[0]
                      ? addDays(new Date(week[0].date), dayOffset)
                      : addDays(defaultDate, dayOffset)

                    const dayEntries = week.filter(
                      entry => new Date(entry.date).getTime() === date.getTime()
                    )

                    const morningShift = dayEntries.find(e => e.shiftType === 'Morning')
                    const eveningShift = dayEntries.find(e => e.shiftType === 'Evening')
                    const offShifts = dayEntries.filter(e => e.shiftType === 'Off')

                    return (
                      <TableRow key={dayOffset}>
                        <TableCell>{format(date, 'EEE, MMM d')}</TableCell>
                        <TableCell>{morningShift?.fullName || '-'}</TableCell>
                        <TableCell>{eveningShift?.fullName || '-'}</TableCell>
                        <TableCell>{offShifts.map(e => e.fullName).join(', ') || '-'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
