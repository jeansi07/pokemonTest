import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useQuery } from "react-query";
import { PokemonLocation, PokemonResponse } from "../../interfaces/types";

type PokemonsTypeProps = {
  open: boolean;
  pokemon: PokemonResponse;
  onClose: () => void;
  colorPokemon: string[];
};
const PokemonsDetails: React.FC<PokemonsTypeProps> = ({
  open,
  onClose,
  pokemon,
  colorPokemon,
}) => {
  const { data, isLoading } = useQuery(
    ["Encounters", pokemon.name],
    async () =>
      (
        await axios.get<PokemonLocation[]>(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}/encounters`
        )
      ).data
  );
  return (
    <Dialog
      as="div"
      className="bg-white fixed top-0 h-screen"
      open={open}
      onClose={() => onClose()}
    >
      <Dialog.Panel
        style={{
          borderColor: colorPokemon[0],
          background:
            colorPokemon.length === 1
              ? colorPokemon[0] + "50"
              : `linear-gradient(to bottom,${colorPokemon
                  .map((color) => color + "50")
                  .join(",")})`,
        }}
        className=" h-full w-full border-2 rounded-r-xl overflow-y-auto"
      >
        <div className="flex justify-end px-3">
          <button
            className="text-gray-500 hover:text-red-600 transition-colors duration-200 text-xl font-bold p-1 rounded-full hover:bg-red-100"
            onClick={() => onClose()}
          >
            &times;
          </button>
        </div>
        <div className="px-4">
          <Dialog.Title>
            <p className="font-bold text-xl mb-2">{pokemon.name} </p>{" "}
          </Dialog.Title>
          <div className="flex flex-col gap-4 items-start bg-white shadow-md rounded-lg p-4">
            {/* Imagen del Pokémon */}
            <div className=" w-full shrink-0">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full  h-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Stats y ubicaciones */}
            <ul className="flex-1 space-y-1 text-sm text-gray-700">
              {pokemon.stats.map((stat, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span className="capitalize text-gray-600">
                    {stat.stat.name}
                  </span>

                  {stat.base_stat > 60 ? (
                    <span className="font-semibold text-green-600">
                      {stat.base_stat}{" "}
                    </span>
                  ) : (
                    <span className="font-semibold text-red-500">
                      {" "}
                      {stat.base_stat}
                    </span>
                  )}
                </li>
              ))}

              {!isLoading && data && (
                <>
                  <li className="mt-3 font-semibold text-blue-600">
                    Location:
                  </li>
                  {data.length === 0 ? (
                    <li className="ml-4 text-gray-500 italic">Desconocido</li>
                  ) : (
                    data.map((item, i) => (
                      <li key={i} className="ml-4 text-gray-600">
                        • {item.location_area.name.replace(/-/g, " ")}
                      </li>
                    ))
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PokemonsDetails;
