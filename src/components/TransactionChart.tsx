import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAuth } from "../context/AuthContext";

export default function TransactionChart() {
  const auth = useAuth();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };

  const labels = auth.user?.account.transactions.map((t) =>
    new Date(
      t.date.split(",")[0].split("/").reverse().join("-")
    ).toLocaleString("default", {
      month: "long",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Transação",
        data: auth.user?.account.transactions.map((t) => t.amount),
        borderColor: "#254A75",
        backgroundColor: "#16569e",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
