import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Pokemons } from "../components";

describe("Testeando el componente Pokémon", () => {
  test("Renderizar componente", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Pokemons />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
      expect(screen.getByText(/venusaur/i)).toBeInTheDocument();
    });

    const pokemonCard = screen.getByText(/charmander/i);
    const otherPokemonCard = screen.getByText(/venusaur/i);
    expect(pokemonCard).toBeInTheDocument();
    expect(otherPokemonCard).toBeInTheDocument();
  });
});
