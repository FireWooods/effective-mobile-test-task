create TABLE shop(
    id SERIAL PRIMARY KEY, 
    shopName VARCHAR(255)
);

create TABLE product(
    id SERIAL PRIMARY KEY, 
    plu VARCHAR(255), 
    productName VARCHAR(255) 
);

create TABLE history_of_actions(
    id SERIAL PRIMARY KEY, 
    shop_id INTEGER,
    product_id INTEGER,
    actions VARCHAR (255),
    created_at DATE
);