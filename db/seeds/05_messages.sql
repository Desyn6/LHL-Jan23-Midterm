-- Insert messages
INSERT INTO messages (message, listing_id, seller_id, client_id)
VALUES
('Is this still available?', 1, 2, 3),
('What is the condition of the item?', 2, 3, 4),
('Would you be willing to negotiate on the price?', 3, 4, 5),
('Can I see some more pictures?', 4, 5, 6),
('I am interested in purchasing this item.', 5, 6, 7),
('Yes, it is still available. Are you interested?', 1, 2, 3),
('The item is in good condition. I can send you some pictures if you would like.', 2, 3, 4),
('I can lower the price a little bit, but not too much. How much are you willing to pay?', 3, 4, 5),
('Sure, let me take some more pictures and I will send them to you.', 4, 5, 6),
('Great, let me know when you are ready to purchase and we can arrange a meeting place.', 5, 6, 7),
('Do you have any other items for sale?', NULL, 3, 2),
('Yes, I have a few other things. What are you looking for?', NULL, 2, 3),
('I am interested in buying a camera. Do you have one for sale?', NULL, 4, 3),
('Yes, I have a DSLR camera that I am selling. Would you like to see some pictures?', NULL, 3, 4),
('Yes, please send me some pictures and information about the camera.', NULL, 4, 3);
