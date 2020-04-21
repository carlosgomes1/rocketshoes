import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';

import api from '../../services/api';
import { formatPrice } from '../../util/format';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

// eslint-disable-next-line react/prop-types
function Home({ addToCart, amount }) {
    const [products, setProducts] = useState([]);

    const setApiProduts = async () => {
        const response = await api.get('/products');

        const data = response.data.map((product) => ({
            ...product,
            priceFormatted: formatPrice(product.price),
        }));
        setProducts(data);
    };

    useEffect(() => {
        setApiProduts();
    }, []);

    const handleAddProduct = (product) => {
        addToCart(product);
    };

    return (
        <ProductList>
            {products.map((product) => (
                <li key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <strong> {product.title} </strong>
                    <span> {product.priceFormatted} </span>

                    <button
                        type="button"
                        onClick={() => handleAddProduct(product)}
                    >
                        <div>
                            <MdAddShoppingCart size={16} color="#FFF" />
                            {amount[product.id] || 0}
                        </div>

                        <span> Adicionar ao carrinho </span>
                    </button>
                </li>
            ))}
        </ProductList>
    );
}

const mapStateToProps = (state) => ({
    amount: state.cart.reduce((amount, product) => {
        amount[product.id] = product.amount;

        return amount;
    }, {}),
});

const mapDispatchToCarts = (dispatch) => {
    return bindActionCreators(CartActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToCarts)(Home);
