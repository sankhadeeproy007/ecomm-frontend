import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

export default class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
  };

  handleSubmit = async (e, updateItem) => {
    e.preventDefault();
    const res = await updateItem({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id }
    });
  };

  render() {
    const { title, description, image, largeImage, price } = this.state;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) =>
          loading ? (
            <p>Loading...</p>
          ) : (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor='title'>
                      Title
                      <input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='Title'
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor='price'>
                      Price
                      <input
                        type='number'
                        id='price'
                        name='price'
                        required
                        placeholder='Price'
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>
                    {image && (
                      <img src={image} width='200' alt='Upload preview' />
                    )}
                    <label htmlFor='description'>
                      Description
                      <textarea
                        type='text'
                        id='description'
                        name='description'
                        required
                        placeholder='Description'
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type='submit'>Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }
      </Query>
    );
  }
}
