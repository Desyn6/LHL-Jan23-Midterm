$(() => {
    window.message = {};


    const getConversation = (listing_id, email) => {
      const values = [listing_id, email];
      const queryString = `SELECT message, created_at from messages
      JOIN listings ON listings.id = messages.listing_id
      WHERE listing_id = $1
      AND seller_id = (select owner_id from listings where id = $1)
      AND client_id = (select id from users where email = $2);`;
      return db.query(queryString, values)
        .then(data => data.rows)
        .catch(error => console.error(error));
    }

    const addMessage = (listing_id, email, message) => {
      const values = [listing_id, email, message];
      const queryString = `
        INSERT INTO messages (message, listing_id, seller_id, client_id)
        VALUES (
          CONCAT(
            (SELECT name FROM users WHERE email = $2),
            ' says: ',
            $3
          ),
          $1,
          (SELECT owner_id FROM listings WHERE id = $1),
          (SELECT id FROM users WHERE email = $2)
        )
        RETURNING *;
      `;
      return db.query(queryString, values)
        .then(data => data.rows)
        .catch(error => console.error(error));
    };


})

name is John (const session.userinfo.email)

insert (message)
value (`${escape(name)}: ${escape(messageString)}`);

ajax insert senderName into sender, ajax insert message into message

req.session.userinfo says:info from teextarea

// insert statement harcoded
// query statement for listing_id, seller_id, client_id
//render message
const createMessageElement = function(object) {
  const $markup = `
  <div class="messages-container">
  <article class="message-container">
    <p>
      ${object.message}
    </p>
  </article>`;
  return $markup;
};





SELECT message, created_at from messages
JOIN listings ON listings.id = messages.listing_id
WHERE listing_id = 1
AND seller_id = (select owner_id from listings where id = 2)
AND client_id = (select id from users where email = 'clee@gmail.com');


INSERT INTO messages (message, listing_id, seller_id, client_id)
VALUES (CONCAT((SELECT name FROM users WHERE email = 'clee@gmail.com'), ' says: ', 'hi, I want to buy your car'), 1, 2, 3);


INSERT INTO messages (message, listing_id, seller_id, client_id)
VALUES (CONCAT((SELECT name FROM users WHERE email = 'clee@gmail.com'), ' says: ', 'hi, I want to buy your car'), 1, 2, 3);



<a style="text-decoration:none"
  id="mailbox${listingObject.id}"
  class="contact"
  href="/mailbox"
  data-lid="${escape(listingObject.id)}"
>
  ✉
</a>

const mailboxLink = document.getElementById(`mailbox${listingObject.id}`);
const lid = mailboxLink.dataset.lid;
console.log(lid);
