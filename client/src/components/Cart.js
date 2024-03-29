import { useEffect, useState } from "react";
import { CartState } from "../context/Context";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const {
    state: { cart, userInfo },
    dispatch,
  } = CartState();

  const [total, setTotal] = useState();

  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price * curr.qty), 0)
    );
  }, [cart]); // means it's called each time cart var changes
  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      alert("You have to sign in first");
      navigate("/signin");
    }
  };
  return (
    <div className="row my-3">
      <div className="col-md-8">
        <ul className="list-group ">
          {cart.map((prod) => (
            <li className="row m-3 " key={prod._id} aria-current="true">
              <div className="col-md-2 ">
                <img
                  className="w-100 rounded"
                  src={prod.image}
                  alt={prod.name}
                />
              </div>
              <div className="col-md-2">{prod.name}</div>
              <div className="col-md-2">{prod.price} ₪ </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={prod.qty}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_CART_QTY",
                      payload: {
                        _id: prod._id,
                        qty: e.target.value,
                      }, // so here we're sending to the payload the id of the current product and the qty of
                      //the current product
                    })
                  }
                >
                  {[...Array(prod.inStock).keys()].map((x) => (
                    <option key={x + 1}> {x + 1}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <i
                  className="fa-solid fa-trash text-danger"
                  style={{ fontSize: "18px", cursor: "pointer" }}
                  onClick={
                    () =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: prod,
                      })
                    //when clicked it will call dispatch with the action
                    // "REMOVE_FROM_CART" and it will supply the product
                  }
                ></i>
              </div>
            </li>
          ))}
        </ul>
        {cart.length > 0 ? (
          <div className="text-center">
            <button
              className="btn btn-primary p-2"
              onClick={() =>
                dispatch({
                  type: "CLEAR_CART",
                })
              }
            >
              <h5>
                <b> Clear Cart</b>
              </h5>
            </button>
          </div>
        ) : (
          <h2 className="text-center my-4 text-danger">Your Cart is Empty !</h2>
        )}
      </div>
      <div
        className="col-md-3 bg-dark text-light text-center "
        style={{ height: "86vh" }}
      >
        <h4 className="m-3">
          Subtotal ({cart.reduce((acc, curr) => acc + Number(curr.qty), 0)})
          items
        </h4>
        <h5 className="m-3"> Total: {total} ₪ </h5>
        <button
          type="button"
          className="btn btn-primary w-75 p-2"
          disabled={cart.length === 0}
          onClick={checkoutHandler}
        >
          <h5>
            <b>Proceed to checkout</b>
          </h5>
        </button>
      </div>
    </div>
  );
};

export default Cart;
