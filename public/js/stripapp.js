const stripe = Stripe('pk_test_51LISkOD4ME8T1OhFFWqhgTt9Ux9o62YAb6Nq7Llf4lXsbVLXXgNIsayi9dvzXnEFBCwfD7jrgu1DcFtK4Mkccpvs00tLenky1r');
const elements = stripe.elements();

var style = {
    base: {
        color: "#fff"
    }
}
const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

const stripeTokenHandler = token => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    console.log(form)
    form.submit();
}

form.addEventListener('submit', e => {
    e.preventDefault();

    stripe.createToken(card).then(res => {
        if (res.error) errorEl.textContent = res.error.message;
        else {
            console.log(res.token)
            stripeTokenHandler(res.token);
        }
    })
})

