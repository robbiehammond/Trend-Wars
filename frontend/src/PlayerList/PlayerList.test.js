import { render, screen } from "@testing-library/react";
import Lobby from "./PlayerList";

test("renders learn react link", () => {
	render(<Lobby />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
