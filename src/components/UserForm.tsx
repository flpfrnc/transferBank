import { Dispatch } from "react";

interface UserCredentials {
  username: string;
  password: string;
}

interface UserFormProps {
  title: string;
  credentials: UserCredentials;
  setCredentials: Dispatch<UserCredentials>;
}

export default function UserForm({ title, credentials, setCredentials }: UserFormProps) {
  return (
    <fieldset className="flex justify-center text-center">
      <legend className="text-xl font-bold italic py-4">{title}</legend>
      <div className="w-full p-8 flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            id="username"
            value={credentials.username || ""}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                username: e.currentTarget.value,
              })
            }
            placeholder=" "
            className="block h-[40px] border px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
          <label
            htmlFor="username"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Usuário
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            id="password"
            value={credentials.password || ""}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.currentTarget.value,
              })
            }
            className="block h-[40px] border px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Senha
          </label>
        </div>
      </div>
    </fieldset>
  );
}
