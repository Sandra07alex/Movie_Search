import logo from "./logo.svg";
import "./App.css";

import styled from "styled-components";
import {
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-dom";
import { searchClient } from "./typesenseAdapter";
import MoviesHits from "./components/moviesHits";
import "instantsearch.css/themes/satellite.css";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #f4f6fa;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 2em 1em;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
  min-height: 80vh;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: unset;
  }
`;

const Sidebar = styled.div`
  min-width: 260px;
  max-width: 320px;
  background: #f7f8fa;
  border-right: 1px solid #e3e6ee;
  border-radius: 16px 0 0 16px;
  padding: 2em 1.5em 2em 1.5em;
  display: flex;
  flex-direction: column;
  gap: 2em;
  @media (max-width: 900px) {
    border-radius: 16px 16px 0 0;
    border-right: none;
    border-bottom: 1px solid #e3e6ee;
    min-width: unset;
    max-width: unset;
    width: 100%;
    padding: 1.5em 1em;
  }
`;

const MainArea = styled.div`
  flex: 1;
  padding: 2em 2em 2em 2em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  @media (max-width: 900px) {
    padding: 1.5em 1em;
  }
`;

const AppHeader = styled.header`
  font-size: 2rem;
  font-weight: 700;
  color: #232526;
  margin-bottom: 1.5em;
  letter-spacing: 1px;
  text-align: left;
`;

const SidebarSection = styled.div`
  margin-bottom: 2em;
`;

function App() {
  return (
    <AppContainer>
      <ContentWrapper>
        <InstantSearch indexName="movies" searchClient={searchClient}>
          <Sidebar>
            <AppHeader>🎬 Movie Search</AppHeader>
            <SidebarSection>
              <SearchBox translations={{ placeholder: 'Search for a movie...' }} />
            </SidebarSection>
            <SidebarSection>
              <h4 style={{ margin: '0 0 0.5em 0', color: '#414345', fontWeight: 500, fontSize: '1.1em' }}>Genres</h4>
              <RefinementList attribute="genres" />
            </SidebarSection>
          </Sidebar>
          <MainArea>
            <MoviesHits />
            <div style={{ marginTop: '2em', alignSelf: 'center' }}>
              <Pagination />
            </div>
          </MainArea>
        </InstantSearch>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
