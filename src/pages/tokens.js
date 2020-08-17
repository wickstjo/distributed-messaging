import React, { useContext, useEffect, useReducer, Fragment } from 'react';
import { Context } from '../assets/context';
import { details, changes } from '../funcs/contract/token';
import { separator } from '../funcs/format';
import { reducer } from '../components/shared/reducer';

import Info from '../components/shared/info';

function Tokens() {

   // GLOBAL STATE
   const { state, dispatch } = useContext(Context)

   // LOCAL STATE
   const [local, set_local] = useReducer(reducer, {
      standard: '',
      symbol: '',
      price: 0,
      available: 0,
      sold: 0,
   })

   // ON LOAD
   useEffect(() => {
      dispatch({
         type: 'header',
         payload: 'tokens'
      })

      // FETCH TOKEN PRICE
      details(state).then(response => {
         set_local({
            type: 'all',
            payload: {
               standard: response[0],
               symbol: response[1],
               price: response[2],
               available: response[3] - response[4],
               sold: response[4],
            }
         })
      })

      // SUBSCRIBE TO CHANGES IN THE CONTRACT ON MOUNT
      const feed = changes(state).on('data', response => {
         set_local({
            type: 'partial',
            payload: {
               available: response.returnValues.capacity - response.returnValues.sold,
               sold: response.returnValues.sold
            }
         })
      })

      // UNSUBSCRIBE ON UNMOUNT
      return () => { feed.unsubscribe(); }

   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <Fragment>
         <Info
            header={ 'Token Manager' }
            data={{
               'Contract': state.contracts.managers.token._address,
               'Standard': local.standard,
               'Price': separator(local.price) + ' WEI',
               'Symbol': local.symbol,
               'Tokens In Circulation': separator(local.sold),
               'Tokens Available': separator(local.available)
            }}
         />
      </Fragment>
   )
}

export default Tokens;