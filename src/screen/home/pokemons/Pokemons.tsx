import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  fetchAllPokemons,
  fetchPokemonTypes,
} from "../../../api/get/getPokemons";
import { PokeCard } from "../../../components/Card";

import axios from "axios";
import { Select } from "../../../components";
import { PokemonCharts } from "../../../components/Charts";
import Loader from "../../../components/Loader/Loader";
import { Logo } from "../../../components/Logo";
import PokemonsDetails from "../../../components/Modal/PokemonsDetails";
import { PokemonResponse } from "../../../interfaces/types";

const ITEMS_PER_PAGE = 20;

export const Pokemons = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredPage, setFilteredPage] = useState(0);
  const [selectTypes, setSelectTypes] = useState<string | null>(null);
  const [selectPokemon, setSelectPokemon] = useState<PokemonResponse | null>(
    null
  );
  const [searchPokemon, setSearchPokemon] = useState<string>("");
  const [typesColors, setTypesColors] = useState<Record<string, string>>({});

  const { data: pokemons, isLoading: isLoadingPokemons } = useQuery(
    ["pokemons", currentPage, searchPokemon],
    () =>
      fetchAllPokemons(
        currentPage * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE,
        searchPokemon
      ),
    { keepPreviousData: true }
  );

  const { data: filteredPokemons, refetch } = useQuery(
    ["typePokemon", selectTypes],
    () => fetchPokemonsByType(),
    {
      enabled: !!selectTypes,
    }
  );

  const { data: types } = useQuery(["Type"], fetchPokemonTypes, {
    onSuccess: ({ results }) => {
      const colors: Record<string, string> = {};
      const randomColor = () =>
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();
      results.forEach((type) => (colors[type.name] = randomColor()));
      setTypesColors(colors);
    },
    refetchOnWindowFocus: false,
  });

  const fetchPokemonsByType = async () => {
    const selectedType = types?.results.find(
      (type) => type.name === selectTypes
    );
    if (!selectedType) return [];
    return Promise.all(
      selectedType.pokemon.map(
        async (pokemon) =>
          (await axios.get<PokemonResponse>(pokemon.pokemon.url)).data
      )
    );
  };

  const pokemonsToShow = () => {
    if (selectTypes && filteredPokemons && searchPokemon === "") {
      const start = filteredPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return filteredPokemons.slice(start, end);
    }
    return pokemons?.results;
  };

  const handlePreviousPage = () => {
    if (selectTypes) {
      if (filteredPage > 0) setFilteredPage((prev) => prev - 1);
    } else {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (selectTypes) {
      if (
        filteredPokemons &&
        (filteredPage + 1) * ITEMS_PER_PAGE < filteredPokemons.length
      ) {
        setFilteredPage((prev) => prev + 1);
      }
    } else {
      if (pokemons?.next) setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setFilteredPage(0);
    refetch();
  }, [selectTypes]);

  return (
    <main className="container py-3">
      <div>
        <Logo />
      </div>
      <PokemonCharts
        onClick={({ name }) => setSelectTypes(name)}
        types={
          types?.results.map((type) => ({
            name: type.name,
            count: type.pokemon.length,
            color: typesColors[type.name],
          })) ?? []
        }
      />
      <div className="flex-col px-5 lg:px-0 lg:flex lg:flex-row gap-4 mb-5 items-center justify-between">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            Busca tu Pokémon por nombre
          </label>
          <input
            id="name"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400"
            type="text"
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
            placeholder="Busca tu pokemon favorito..."
          />
        </div>
        {selectTypes && (
          <button
            className=" text-sm text-blue-600 underline py-3 lg:py-0"
            onClick={() => setSelectTypes(null)}
          >
            Ver todos los Pokémon
          </button>
        )}
        <div>
          <Select
            onChange={(value: string) => setSelectTypes(value)}
            selectTypes={types?.results.map((i) => i.name) ?? []}
            values={selectTypes ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 px-2 lg:px-0 gap-4 lg:grid-cols-3 md:grid-cols-2">
        <>
          {pokemonsToShow()?.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">
              Pokemon no encontrado
            </div>
          )}
        </>
        {pokemonsToShow()?.map((pokemon) => (
          <PokeCard
            onClick={() => setSelectPokemon(pokemon)}
            key={pokemon.id}
            pokemon={{
              title: pokemon.name,
              abilities: pokemon.abilities.map(
                (ability) => ability.ability.name
              ),
              heigth: pokemon.height,
              weigth: pokemon.weight,
              types: pokemon.types.map((type) => ({
                name: type.type.name,
                color: typesColors[type.type.name],
              })),
              image: pokemon.sprites.front_default,
              id: pokemon.id,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center my-5 px-3 lg:px-0">
        <button
          onClick={handlePreviousPage}
          disabled={selectTypes ? filteredPage === 0 : currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {selectTypes ? filteredPage + 1 : currentPage + 1}</span>
        <button
          onClick={handleNextPage}
          disabled={
            selectTypes
              ? !filteredPokemons ||
                (filteredPage + 1) * ITEMS_PER_PAGE >= filteredPokemons.length
              : !pokemons?.next
          }
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isLoadingPokemons && <Loader />}
      {selectPokemon && (
        <PokemonsDetails
          colorPokemon={selectPokemon.types.map(
            (type) => typesColors[type.type.name]
          )}
          open={true}
          onClose={() => setSelectPokemon(null)}
          pokemon={selectPokemon}
        />
      )}
    </main>
  );
};
