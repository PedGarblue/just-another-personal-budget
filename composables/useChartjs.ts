import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js'

let registered = false

export function useChartjs() {
  if (!registered) {
    Chart.register(
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend,
      BarElement,
      LineElement,
      PointElement,
      ArcElement
    )
    registered = true
  }
}
