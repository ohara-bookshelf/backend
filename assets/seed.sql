-- (isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l)

COPY public."Book"(isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l)
FROM '/var/lib/postgresql/data/unique_books.csv'
CSV HEADER DELIMITER ';' QUOTE '"' ESCAPE '\';