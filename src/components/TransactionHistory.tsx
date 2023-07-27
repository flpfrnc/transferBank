import { Fragment } from "react";
import { useAuth } from "../context/AuthContext";

export default function TransactionHistory() {
  const auth = useAuth();

  return (
    <div className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8 px-4 absolute translate-x-[4.5rem] w-[400px] top-32">
      <span className="italic font-bold text-[#254A75]">
        TOTAL APÓS TRANSAÇÕES REALIZADAS:
      </span>
      <span className="italic font-bold text-[#254A75] py-2">
        {auth.user?.account?.transactions
          ?.reduce(function (acc, value) {
            return acc + value.amount;
          }, 0)
          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
      <hr className="w-full" />
      <div className="w-full h-[600px] overflow-y-scroll">
        {auth.user?.account?.transactions?.map((t, idx) => (
          <Fragment key={idx}>
            <div className="grid grid-cols-2 gap-2 w-full py-2" key={idx}>
              <span
                className={`text-center text-xl font-bold col-span-2 ${
                  t.amount > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {t.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="col-span-2 font-bold">
                Comprovante de transação PIX
              </span>
              <span className="col-span-2 text-sm">{t.date}</span>
              <span className="col-span-2 font-bold text-sm">
                Informações do Destinatário
              </span>
              <span className="col-span-2 font-bold text-sm">
                Nome/Chave Pix/Conta:
              </span>
              <span className="col-span-2 text-sm">{t.receiver}</span>
              <span className="col-span-2 font-bold text-sm">
                Informações do Pagador
              </span>
              <span className="col-span-2 font-bold text-sm">Nome:</span>
              <span className="col-span-2 text-sm">{t.sender}</span>
            </div>
            <hr className="w-full" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
