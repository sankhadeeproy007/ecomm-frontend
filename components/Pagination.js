import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import { perPage } from '../config';

import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ error, data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.itemsConnection) return <p>No items</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        return (
          <PaginationStyles>
            <Head>
              <title>
                Sick Fits! | Page {page} of {pages}
              </title>
            </Head>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page - 1 }
              }}
            >
              <a className='prev' aria-disabled={page <= 1}>
                ⏮️ Prev
              </a>
            </Link>
            <p>
              Page {page} of {pages}
            </p>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page + 1 }
              }}
            >
              <a className='prev' aria-disabled={page >= pages}>
                Next ⏭️
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
