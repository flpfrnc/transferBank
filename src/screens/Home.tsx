import { useState } from "react";
import { User, useAuth } from "../context/AuthContext";
import { MdKey, MdPix } from "react-icons/md";
import { BsReceipt } from "react-icons/bs";
import { updateUser } from "../utils";
import CurrencyInput from "react-currency-input-field";
import TransactionChart from "../components/TransactionChart";
import TransactionHistory from "../components/TransactionHistory";

export default function Home() {
  const auth = useAuth();
  const [pixKey, setPixKey] = useState("");
  const [registerPixKey, setRegisterPixKey] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [pixTransferOpen, setPixTransferOpen] = useState(false);
  const [pixRegisterOpen, setPixRegisterOpen] = useState(false);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);

  function handlePixKey(value: string) {
    const userStorage = localStorage.getItem("users");
    if (!userStorage || !auth.user) return;

    const users: User[] = JSON.parse(userStorage);

    const notUniquePixKey = users.filter((user) =>
      user.pixKeys.includes(value)
    );

    let userObject = auth.user;

    if (!userObject || !value || notUniquePixKey) {
      return alert("Não foi possível cadastrar a chave PIX");
    }

    if (userObject?.pixKeys?.includes(value)) {
      return alert("Já existe um registro para essa chave PIX");
    }

    userObject?.pixKeys?.push(value);

    updateUser(userObject);

    setRegisterPixKey("");
    return alert("Chave PIX cadastrada com sucesso");
  }

  const handleTransactionValue = (value: string) => {
    setTransactionAmount(value);
  };

  function handleTransaction(pixKey: string, amount: number) {
    const userStorage = localStorage.getItem("users");

    if (!userStorage || !auth.user) return;

    const users: User[] = JSON.parse(userStorage);
    const targetUser = users.find((user) => user.pixKeys?.includes(pixKey));

    if (!targetUser) {
      return alert("Nenhum usuário com essa chave foi encontrado");
    }

    if (JSON.stringify(targetUser) === JSON.stringify(auth.user)) {
      return alert("Não é possível enviar para sua prórpia chave PIX");
    }

    if (auth.user.account.balance < amount) {
      return alert("Você não tem saldo suficiente");
    }

    const transactionDate = new Date();

    targetUser.account.balance += amount;
    targetUser.account.transactions.push({
      method: "pix",
      amount: amount,
      sender: auth.user.username,
      receiver: targetUser.username,
      type: "deposito",
      date: transactionDate.toLocaleString("pt-BR"),
    });

    auth.user.account.balance -= amount;
    auth.user.account.transactions.push({
      method: "pix",
      amount: -amount,
      sender: auth.user.username,
      receiver: `${targetUser.username} - ${pixKey}`,
      type: "retirada",
      date: transactionDate.toLocaleString("pt-BR"),
    });

    auth.updateUser(auth.user);
    auth.updateUser(targetUser);
    setPixKey("");
    setTransactionAmount("");
    return alert("Transação realizada com sucesso");
  }

  function handleDeposit(amount: number) {
    setDepositLoading(true);

    setTimeout(() => {
      if (!auth.user) return;

      const transactionDate = new Date();

      auth.user.account.balance += amount;
      auth.user.account.transactions.push({
        method: "pix",
        amount: +amount,
        sender: "TransferBank",
        receiver: `${auth.user.username} - ${auth.user.account.account}`,
        type: "retirada",
        date: transactionDate.toLocaleString("pt-BR"),
      });

      auth.updateUser(auth.user);
      setDepositLoading(false);
      return alert("Depósito realizado com sucesso");
    }, 3000);
  }

  return (
    <div className="flex gap-2 p-8 justify-center">
      <div className="mt-8 w-full">
        <button
          title="Exibir histórico de transações"
          onClick={() => setTransactionHistoryOpen(!transactionHistoryOpen)}
          className="top-0 italic font-bold bg-[#254A75] hover:bg-[#16569e] active:bg-[#0e335d] text-xl text-white p-4 rounded-full"
        >
          <BsReceipt size={20} />
        </button>

        {transactionHistoryOpen && <TransactionHistory />}
      </div>
      <div>
        <div className="flex flex-col sm:flex-col xl:flex-row sm:w-fit xl:w-fit p-2 gap-4 ">
          <div className="grid grid-cols-1 gap-2 py-2 w-[300px]">
            <span className="col-span-2 font-bold">
              Extrato da conta de {auth.user?.username}
            </span>
            <span
              className={`text-xl font-bold col-span-2 ${
                auth.user && auth.user?.account.balance > 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {auth.user?.account.balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span className="col-span-2 font-bold text-sm">
              Nome/Chave Pix/Conta:
            </span>
            <span className="col-span-2 text-sm">{auth.user?.username}</span>
            <span className="col-span-2 text-sm">
              {auth.user?.account.account}
            </span>
            <span className="col-span-2 font-bold text-sm">
              Suas chaves PIX:
            </span>
            {auth.user?.pixKeys.map((pixKey) => (
              <span key={pixKey} className="col-span-2 font-bold text-sm">
                {pixKey}
              </span>
            ))}
          </div>
          <div className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8 gap-4 w-[300px]">
            <div className="flex gap-2 justify-center items-center">
              <span className="italic font-bold text-[#254A75] text-md">
                Adicionar Chave PIX
              </span>
              <button
                title="Clique para adicionar uma chave pix"
                onClick={() => setPixRegisterOpen(!pixRegisterOpen)}
                className="italic font-bold bg-[#254A75] hover:bg-[#16569e] active:bg-[#0e335d] text-xl text-white p-2 rounded-full"
              >
                <MdKey size={15} />
              </button>
            </div>
            {pixRegisterOpen && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <fieldset>
                  <input
                    type="text"
                    value={registerPixKey}
                    onChange={(e) => setRegisterPixKey(e.target.value)}
                    className="border-[#254A75] border rounded-lg px-2 text-center"
                  />
                </fieldset>
                <button
                  onClick={() => handlePixKey(registerPixKey)}
                  className="text-white bg-[#254A75] py-1 px-4 rounded-lg hover:bg-[#16569e] active:bg-[#0e335d]"
                >
                  Adicionar
                </button>
              </div>
            )}
          </div>
          <div className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8 gap-4 w-[300px]">
            <div className="flex gap-2 justify-center items-center">
              <span className="italic font-bold text-[#254A75] text-md">
                Realizar transferência PIX
              </span>
              <button
                title="Clique para adicionar uma chave pix"
                onClick={() => setPixTransferOpen(!pixTransferOpen)}
                className="italic font-bold bg-[#254A75] hover:bg-[#16569e] active:bg-[#0e335d] text-xl text-white p-2 rounded-full"
              >
                <MdPix size={15} />
              </button>
            </div>
            {pixTransferOpen && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <fieldset className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Chave PIX"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="border-[#254A75] border rounded-lg px-2 text-center"
                  />
                  <CurrencyInput
                    id="pix"
                    name="pix"
                    className="border-[#254A75] border rounded-lg px-2 text-center"
                    placeholder="Valor da transferência"
                    decimalsLimit={2}
                    decimalScale={2}
                    prefix="R$"
                    decimalSeparator=","
                    intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                    value={transactionAmount}
                    onValueChange={(value) =>
                      handleTransactionValue(value || "")
                    }
                  />
                </fieldset>
                <button
                  onClick={() =>
                    handleTransaction(
                      pixKey,
                      Number(transactionAmount.replace(",", "."))
                    )
                  }
                  className="text-white bg-[#254A75] py-1 px-4 rounded-lg hover:bg-[#16569e] active:bg-[#0e335d]"
                >
                  Transferir
                </button>
              </div>
            )}
          </div>
          <div className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8 gap-4 w-[300px]">
            <div className="flex flex-col gap-2 justify-center items-center">
              <button
                onClick={() => handleDeposit(1000)}
                className="italic text-[#254A75] bg-white py-1 px-4 rounded-lg  font-bold"
              >
                Receber Valores
              </button>
              {depositLoading && (
                <span className="italic text-gray-500 bg-white py-1 px-4 rounded-lg  font-bold">
                  Carregando depósito
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-[650px] flex items-center">
          <TransactionChart />
        </div>
      </div>
    </div>
  );
}
