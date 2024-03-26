import React, {createContext, useEffect, useState} from "react";
import all_product from "../Components/Assets/all_product"

export const ShopContext = createContext(null);
const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < all_product.length+1; index++) {
        cart[index] = 0;
    }
    return cart; 

}


const ShopContextProvider = (props) => {

    
    const [cartItems,setCartItems] = useState(getDefaultCart());
    
   
    const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')){
             fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
             })
             .then((response)=>response.json())
             .then((data)=>console.log(data))
        }
    }
    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
               method:'POST',
               headers:{
                   accept:'application/form-data',
                   'auth-token':`${localStorage.getItem('auth-token')}`,
                   'Content-type':'application/json',
               },
               body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data))
       }
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
           if(cartItems[item]>0) 
           {
            let itemInfo = all_product.find((product)=>product.id===Number(item))
            totalAmount += itemInfo.new_price * cartItems[item];
           }
           
        }
        return totalAmount;
    }
    const getTotalcartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+=cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {getTotalcartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;