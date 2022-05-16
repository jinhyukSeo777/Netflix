import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import MovieDetail from "./Routes/MovieFiles/MovieDetail";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";
import TVDetail from "./Routes/TVFiles/TVDetail";

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <Switch>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/detail/movie/:movieId">
            <MovieDetail />
          </Route>
          <Route path="/detail/tv/:tvId">
            <TVDetail />
          </Route>
          <Route path="/tv">
            <TV />
          </Route>
          <Route path="/tvs/:tvId/:clickedSession">
            <TV />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
