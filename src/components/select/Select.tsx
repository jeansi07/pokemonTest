import { TypePokemon } from "../../interfaces/types";

export const Select = ({ onChange, selectTypes, values }: TypePokemon) => {
  return (
    <div className="w-full ">
      <label
        htmlFor="language"
        className="block mb-2 text-lg font-medium text-gray-700"
      >
        Tipo de Pokémon
      </label>
      <select
        id="language"
        value={values}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full  px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
      >
        {selectTypes.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
