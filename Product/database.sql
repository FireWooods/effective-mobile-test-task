create TABLE shop(
    id SERIAL PRIMARY KEY, 
    shopName VARCHAR(255)
);

create TABLE product(
    id SERIAL PRIMARY KEY, 
    plu VARCHAR(255), 
    productName VARCHAR(255) 
);

create TABLE shelf(
    id SERIAL PRIMARY KEY, 
    product_id INTEGER, 
    shop_id INTEGER, 
    quantity INTEGER,
    created_at DATE,
    FOREIGN KEY (product_id) REFERENCES product (id), 
    FOREIGN KEY (shop_id) REFERENCES shop (id)
);

create TABLE orders(
    id SERIAL PRIMARY KEY, 
    product_id INTEGER, 
    shop_id INTEGER, 
    quantity INTEGER,
    created_at DATE, 
    FOREIGN KEY (product_id) REFERENCES product (id), 
    FOREIGN KEY (shop_id) REFERENCES shop (id)
);