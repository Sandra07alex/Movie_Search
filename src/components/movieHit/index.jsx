import React from "react";
import { Highlight } from "react-instantsearch-dom";
import styled from "styled-components";
import MovieHighlight from "../movieHighlight";

const HitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  margin: 2em 1em;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.10);
  padding: 1.5em 1em 1.5em 1em;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  }
`;

const MoviePoster = styled.img`
  width: 180px;
  height: auto;
`;

const Title = styled.div`
  font-weight: black;
  font-size: 24px;
  margin-top: 10px;
  text-align: center;
`;

const Overview = styled.div`
  /* max-height: 9px; */
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 1em;
  line-height: 1.3;
  font-size: 14px;
`;

const Rating = styled.b`
  font-size: 16px;
  color: #2ecc71;
  margin-top: 1rem;
`;

const Genre = styled.div`
  font-size: 14px;
  color: #236adb;
  margin-top: 10px;
`;

const GenreBadge = styled.div`
  background: #236adb;
  color: #fff;
  border-radius: 8px;
  padding: 0.2em 0.8em;
  font-size: 13px;
  margin-top: 0.5em;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: inline-block;
`;

const HitsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export function MovieHit(props) {
  const { hit } = props;

  return (
    <HitContainer>
      <MoviePoster src={hit.image} alt={hit.title} />
      <Title>
        <MovieHighlight hit={hit} attribute="title" />
      </Title>
      {hit.genres && Array.isArray(hit.genres) && hit.genres.length > 0 && (
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          {hit.genres.map((genre, idx) => (
            <GenreBadge key={idx}>{genre}</GenreBadge>
          ))}
        </div>
      )}
      <Overview>
        <MovieHighlight hit={hit} attribute="overview" />
      </Overview>
      <Rating>
        <MovieHighlight hit={hit} attribute="vote_average" />
      </Rating>
    </HitContainer>
  );
}
