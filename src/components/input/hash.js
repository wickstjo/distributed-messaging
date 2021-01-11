import React, { useEffect } from 'react';

export default ({ data, placeholder, length, update, id }) => {

    // VALIDATE ON INITIAL LOAD
    useEffect(() => {
        validate(data.value)

    // eslint-disable-next-line
    }, [])

    // VALIDATE USER INPUT
    function validate(input) {

        // CHECK FOR VALID LENGTH
        const result = input.length === length

        // UPDATE PARENT STATE
        update({
            type: 'field',
            payload: {
                name: id,
                value: {
                    value: input,
                    status: result
                }
            }
        })
    }

    return (
        <div id={ 'field' }>
            <input
                type={ 'text' }
                className={ data.status ? 'good-input' : 'bad-input' }
                placeholder={ placeholder }
                value={ data.value }
                onChange={ event => { validate(event.target.value) }}
            />
        </div>
    )
}