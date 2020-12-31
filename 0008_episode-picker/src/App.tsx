import React, { Fragment, useContext, useEffect } from 'react';
import { Store } from './Store';

import { IAction, IEpisode } from './interfaces';

function App(): JSX.Element {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  const fetchDataAction = async () => {
    const url =
      'https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes';
    const data = await fetch(url);
    const dataJson = await data.json();

    return dispatch({
      type: 'FETCH_DATA',
      payload: dataJson._embedded.episodes,
    });
  };

  const toggleFavAction = (episode: IEpisode): IAction => {
    const episodeInFav = state.favorites.includes(episode);

    let dispatchObj = {
      type: 'ADD_FAV',
      payload: episode,
    };

    if (episodeInFav) {
      const favWithoutEpisode = state.favorites.filter(
        (fav: IEpisode) => fav.id !== episode.id
      );

      dispatchObj = { type: 'REMOVE_FAV', payload: favWithoutEpisode };
    }

    return dispatch(dispatchObj);
  };

  // console.log(state);

  return (
    <Fragment>
      <header className="header">
        <h1>Rick and Morty</h1>
        <p>Pick your favorite episode!</p>
      </header>
      <section className="episode-layout">
        {state.episodes.map((episode: IEpisode) => (
          <section key={episode.id} className="episode-box">
            <img
              src={episode.image.medium}
              alt={`Rick and Morty ${episode.name}`}
            />
            <div>{episode.name}</div>
            <section>
              <div>
                Season : {episode.season} Number : {episode.number}
              </div>
              <button type="button" onClick={() => toggleFavAction(episode)}>
                {state.favorites.find((fav: IEpisode) => fav.id === episode.id)
                  ? 'Unfav'
                  : 'Fav'}
              </button>
            </section>
          </section>
        ))}
      </section>
    </Fragment>
  );
}

export default App;
