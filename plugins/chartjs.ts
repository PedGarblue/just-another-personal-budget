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
export default defineNuxtPlugin(() => {
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
})
