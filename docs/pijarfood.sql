--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-03-26 11:46:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 19234)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    recipe_id character varying(255) NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 27435)
-- Name: liked_recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liked_recipes (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    recipe_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.liked_recipes OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 19227)
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    image text,
    ingredients text NOT NULL,
    video text,
    user_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 27442)
-- Name: saved_recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_recipes (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    recipe_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.saved_recipes OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 19220)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    photo character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3335 (class 0 OID 19234)
-- Dependencies: 211
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('edaa0917-d026-4fdc-a357-cb0336b87967', '22d3a143-d572-40ac-8a22-f55da593f68b', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', 'I made this with blueberries and semisweet mini morsels, minus the sauce (I’m in recovery-too much temptation even if the alcohol does cook out) but it wasn’t necessary! It was fabulous and exactly the right textures it needed to be inside & out, so thank you very much. I will make this again, no doubt.', '2022-03-25 09:26:22.759266', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('a83149f2-f82b-41da-a33d-a1c0f47858bd', '431103df-7f56-4778-ba72-f4f3927d3d49', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', 'This is my 3rd time making this BP, it is fantastic I’m making this one as a gift, with a “no raisins” request☹️. I changed up one thing and that is, in the mixture I use a little less than a Cup of sugar instead of two Cups of sugar. I don’t think it’s missed due to the bourbon sauce and raisins. But I didn’t put any raisins in this one, so we’ll see!', '2022-03-25 09:33:15.983242', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('ff4d1378-0f14-44c5-a876-e338dc421932', '431103df-7f56-4778-ba72-f4f3927d3d49', 'acd99006-76a5-40cc-8908-674ca13c1d1f', 'Easy and great recipe. Will diffidently make again!', '2022-03-25 09:44:00.865334', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('0d23a3a0-5426-4c57-a056-8446c6b91311', '6ba03ee8-390d-4d68-a2f0-c1bf89a4c019', 'acd99006-76a5-40cc-8908-674ca13c1d1f', 'I have tried so many cilantro lime rice recipies (admittedly an addict) and this is by far the best one! Perfect balance between the lime flavors and salt. I appreciate this recipe a ton, thanks for posting!', '2022-03-25 09:55:01.251034', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('5765ad19-af0b-444e-99ac-3e25c1147f6a', '7bc9551f-97f0-4aab-9af8-0fc4c3422f80', 'db6b1ef8-9eb4-43c3-8501-5ebf40362725', 'Lovely recipe, but this most definitely is not Irish Stew. Its a casserole of indeterminate origin which might be delicious but is not Irish. Under no circumstances is either red wine or garlic, tomato paste (Italian) or Worcestershire sauce (English) or sugar (?) ever in an Irish stew. An Irish stew was made by very poor people with only what came to hand and the above was most surely not it. Look elsewhere if you want an authentic Irish stew but by all means cook away for a tasty dinner.', '2022-03-25 09:58:54.567777', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('e9fbac79-87f7-4004-b470-0c4dd9656e0c', '0c5905a9-732e-4919-8099-7d18f2063a75', 'db6b1ef8-9eb4-43c3-8501-5ebf40362725', 'I left out the 2 cups of water, and it turned out fine. 2 cups of water just sounded like too much.', '2022-03-25 09:59:49.049154', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('6651d047-aa06-48ba-8155-3723626c52a0', '0d7f82c0-d88c-427d-bda7-3acd36316337', '0ace0aa4-6d9b-448f-9641-5a54d7d2c193', 'Made my second pie today for my sister. This pie is DELICIOUS!!', '2022-03-25 10:04:36.323547', NULL);
INSERT INTO public.comments (id, user_id, recipe_id, comment_text, created_at, updated_at) VALUES ('1b26bf52-6624-4f47-9d64-1caaec7424e5', '22d3a143-d572-40ac-8a22-f55da593f68b', '0ace0aa4-6d9b-448f-9641-5a54d7d2c193', 'This the best strawberry rhubarb pie ever!!! My mother-in-law was raised Mennonite. She always put a crumb topping on her fruit pies. So good and not too sweet. Just put a little less sugar in the fruit. Topping: 1/2 C sugar, 1 C AP flour, 1/3 cup butter. Mix until crumbly.', '2022-03-25 10:05:23.391212', NULL);


--
-- TOC entry 3336 (class 0 OID 27435)
-- Dependencies: 212
-- Data for Name: liked_recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.liked_recipes (id, user_id, recipe_id, created_at) VALUES ('2d5d31f3-a8e6-4e82-bacd-1fad22868b34', '031303d0-efa5-44e8-a024-e583ddb37893', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', '2022-03-26 08:05:40.566244');
INSERT INTO public.liked_recipes (id, user_id, recipe_id, created_at) VALUES ('5d998afe-0f55-45d4-8507-7dbccbc8c2ca', '431103df-7f56-4778-ba72-f4f3927d3d49', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', '2022-03-26 09:47:09.774601');
INSERT INTO public.liked_recipes (id, user_id, recipe_id, created_at) VALUES ('9982a7ca-90ee-42c5-89e2-e1749783d221', '031303d0-efa5-44e8-a024-e583ddb37893', 'acd99006-76a5-40cc-8908-674ca13c1d1f', '2022-03-26 09:48:50.581921');
INSERT INTO public.liked_recipes (id, user_id, recipe_id, created_at) VALUES ('e2f8a033-fa40-451f-aaa1-9acaa8adb4d6', '22d3a143-d572-40ac-8a22-f55da593f68b', '37d73f2d-a2e9-4ea2-84c6-ab0c5db5a4d8', '2022-03-26 09:50:33.91466');
INSERT INTO public.liked_recipes (id, user_id, recipe_id, created_at) VALUES ('af82eae8-9f0a-4459-8197-889fd373f7e7', '6ba03ee8-390d-4d68-a2f0-c1bf89a4c019', 'db6b1ef8-9eb4-43c3-8501-5ebf40362725', '2022-03-26 09:51:51.682725');


--
-- TOC entry 3334 (class 0 OID 19227)
-- Dependencies: 210
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('0ace0aa4-6d9b-448f-9641-5a54d7d2c193', 'Strawberry Rhubarb Pie', 'https://www.simplyrecipes.com/thmb/jgry29ar2dXB1F7iGBuCP1XofNM=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2014__06__strawberry-rhubarb-pie-horiz-a-640-bc18be9276f84cda84ec394acf22ef7c.jpg', '3 1/2 cups (440g) rhubarb stalks cut into 1/2 inch pieces (trim away and discard the leaves which are poisonous; trim ends)
2 cups (280g) stemmed and sliced strawberries
3/4 to 1 cup sugar (depending on how tart/sweet you like your pie)
4 tablespoons quick cooking ("minute") tapioca
1/4 teaspoon salt
1 teaspoon finely grated orange zest
1 double-crust 9-inch pie dough recipe, like this one or your favorite pie crust recipe
1 large egg white, beaten, or 1 tablespoon cream for brushing, optional', 'https://cdn.jwplayer.com/videos/sOwk0n1g-tXzwfO7V.mp4', '031303d0-efa5-44e8-a024-e583ddb37893', '2022-03-25 07:36:17.167671', '2022-03-25 10:04:07.385');
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('37d73f2d-a2e9-4ea2-84c6-ab0c5db5a4d8', 'Berry and Banana Terrine', 'https://www.simplyrecipes.com/thmb/nj98VzwKKNgH1H5t1CixafUJHg4=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2006__06__berry-banana-terrine-horiz-b-1800-6fe379d203664f98a535543aa4d9fc38.jpg', '2 envelopes (1/4 ounce each) unflavored gelatin
2 cups white grape juice, divided
1/2 cup white granulated sugar
6 cups of mixed fresh berries and slices of banana (berries can include blueberries, raspberries, blackberries, and sliced or quartered strawberries)', 'https://cdn.jwplayer.com/videos/78rL3uBc-tXzwfO7V.mp4', '031303d0-efa5-44e8-a024-e583ddb37893', '2022-03-25 07:47:10.284051', NULL);
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('db6b1ef8-9eb4-43c3-8501-5ebf40362725', 'Irish Beef Stew', 'https://www.simplyrecipes.com/thmb/VHXHZ2RywNmHuEGLTKupt4zZV5k=/580x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2015__03__irish-beef-stew-horiz-a2-1800-24f1087421414a77a25518c0897d7e23.jpg', '1 1/4 pounds well-marbled chuck beef stew meat, cut into 1 1/2-inch chunks
3 teaspoons salt, or more to taste
1/4 cup extra virgin olive oil
6 garlic cloves, minced
4 cups  beef stock 
2 cups water
1 cup Guinness extra stout
1 cup hearty red wine
2 tablespoons tomato paste
1 tablespoon sugar
1 tablespoon dried thyme
1 tablespoon Worcestershire sauce
2 bay leaves
2 tablespoons butter
3 pounds russet potatoes, peeled, cut into 1/2-inch pieces (about 7 cups)
1 large onion, chopped (1 1/2 to 2 cups)
3 to 4 carrots or parsnips, cut into 1/2-inch pieces (2 cups)
1/2 teaspoon freshly ground black pepper
2 tablespoons chopped fresh parsley', 'https://cdn.jwplayer.com/videos/yGvA1M9t-tXzwfO7V.mp4', '031303d0-efa5-44e8-a024-e583ddb37893', '2022-03-25 07:41:10.061233', NULL);
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('acd99006-76a5-40cc-8908-674ca13c1d1f', 'Cilantro Lime Rice', 'https://www.simplyrecipes.com/thmb/DBtO2Ztv0s3jLu1N7JpR5juV9_c=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2016__09__cilantro-lime-rice-horiz-a2-2000-86dcc93372164caa862e1c131f15dafb.jpg', '2 tablespoons extra virgin olive oil
1 1/2 cups basmati rice, or other long-grain white rice
1 clove garlic, minced
2 1/4 cups water
1 teaspoon salt
Finely grated zest of one lime
3 tablespoons lime juice
1 cup lightly packed chopped cilantro (leaves and tender stems only)', 'https://cdn.jwplayer.com/videos/bi5e74Mv-tXzwfO7V.mp4', '0c5905a9-732e-4919-8099-7d18f2063a75', '2022-03-25 07:50:12.21807', NULL);
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('2f0f8cd1-aa15-4fec-90d2-715d9349ff59', 'Shrimp Scampi', 'https://www.simplyrecipes.com/thmb/1kaDEKLNOuOx_bS3ymmjWyBTKF4=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2015__03__shrimp-scampi-horiz-a-1200-91087a068e1b44fe8904e2356f7a0239.jpg', '1 pound (16 to 20 count) large raw shrimp, shelled and de-veined, (if you want, keep the tail on for an attractive presentation)
2 tablespoons extra virgin olive oil
2 to 3 tablespoons butter
Salt
3 to 4 cloves garlic, slivered, or 1 tablespoon minced garlic
1/4 to 1/2 teaspoon red pepper flakes (less or more to taste)
1/2 cup white wine (we recommend a dry white wine, such as a sauvignon blanc)
2 tablespoons finely chopped parsley
Freshly ground black pepper, to taste
1 tablespoon lemon juice', 'https://cdn.jwplayer.com/videos/z9WkUOP3-tXzwfO7V.mp4', '0d7f82c0-d88c-427d-bda7-3acd36316337', '2022-03-25 07:55:32.58909', NULL);
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('c1c3abf2-e755-4700-be16-50059c9d827d', 'Scallion Pancakes', 'https://www.simplyrecipes.com/thmb/n8Z2Ik2EtWtP2KrOLvZe7c-0Nh8=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2017__02__2017-03-21-Scallion-Pancakes-3-67e146150dd14dcdbd178340c4ca71d8.jpg', '2 cups all-purpose flour
1 teaspoon salt
1/2 teaspoon garlic powder, optional
3/4 cup hot (just boiling) water, plus a few more tablespoons, if necessary
1/4 cup canola oil
3 to 4 scallions, thinly sliced', 'https://cdn.jwplayer.com/videos/JHcWsb9T-tXzwfO7V.mp4', '0c5905a9-732e-4919-8099-7d18f2063a75', '2022-03-25 07:53:00.211985', NULL);
INSERT INTO public.recipes (id, title, image, ingredients, video, user_id, created_at, updated_at) VALUES ('0b9464b5-bb72-4185-9e20-ae4c852e82a7', 'Bread Pudding', 'https://www.simplyrecipes.com/thmb/KJq00c0FUq8y9Twu_5GT9sI-utA=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Bread-Pudding-Lead-3-2-f0f7ea30c35b47038d13d110c597f42f.jpg', '1 cup raisins
1 loaf French bread, at least a day old, cut into 1-inch cubes (about 6-7 cups)
4 cups milk
3 large eggs
2 cups sugar
2 tablespoons vanilla extract
1/4 cup Kentucky bourbon whiskey
1/4 teaspoon allspice
1/4 to 1/2 teaspoon cinnamon
3 tablespoons butter, melted', 'https://cdn.jwplayer.com/videos/2Kbyo2Sf-tXzwfO7V.mp4', '0d7f82c0-d88c-427d-bda7-3acd36316337', '2022-03-25 07:58:37.979765', NULL);


--
-- TOC entry 3337 (class 0 OID 27442)
-- Dependencies: 213
-- Data for Name: saved_recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.saved_recipes (id, user_id, recipe_id, created_at) VALUES ('77ac6945-0c2f-486a-86bd-ac2264da47b3', '031303d0-efa5-44e8-a024-e583ddb37893', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', '2022-03-26 08:05:56.463401');
INSERT INTO public.saved_recipes (id, user_id, recipe_id, created_at) VALUES ('ca7d54e4-7cb9-4909-b884-d55d474e8d2d', '431103df-7f56-4778-ba72-f4f3927d3d49', '0b9464b5-bb72-4185-9e20-ae4c852e82a7', '2022-03-26 09:47:40.946626');
INSERT INTO public.saved_recipes (id, user_id, recipe_id, created_at) VALUES ('0d719bbf-5a5b-4c6e-99da-a6dd2189a89c', '031303d0-efa5-44e8-a024-e583ddb37893', 'acd99006-76a5-40cc-8908-674ca13c1d1f', '2022-03-26 09:48:59.98275');
INSERT INTO public.saved_recipes (id, user_id, recipe_id, created_at) VALUES ('f7aae98d-dcaf-42e5-b0ec-a918d8b51aa3', '22d3a143-d572-40ac-8a22-f55da593f68b', '37d73f2d-a2e9-4ea2-84c6-ab0c5db5a4d8', '2022-03-26 09:50:43.133419');
INSERT INTO public.saved_recipes (id, user_id, recipe_id, created_at) VALUES ('3aa81602-b83b-456b-aa71-5534c7c90006', '6ba03ee8-390d-4d68-a2f0-c1bf89a4c019', 'db6b1ef8-9eb4-43c3-8501-5ebf40362725', '2022-03-26 09:51:57.971891');


--
-- TOC entry 3333 (class 0 OID 19220)
-- Dependencies: 209
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('031303d0-efa5-44e8-a024-e583ddb37893', 'Nur Muhammad Alif Putra Setiawan', 'muhammadalifputra8888@gmail.com', '$2b$10$zx3Ib2WeR09LUfbIfMXg1.4vPmG2JWwWIT8xkrMwren/u/uYZ2.mm', '081234567890', 'https://www.w3schools.com/howto/img_avatar.png', '2022-03-25 06:03:36.764084', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('0c5905a9-732e-4919-8099-7d18f2063a75', 'Ervin Howell', 'shanna@melissa.tv', '$2b$10$3PVLISAOMud1Z3XDfHpqteyvGjOgLeo6HwyQ.TAXoKHkSUnaz0sz6', '0106926593', 'https://www.w3schools.com/w3images/avatar2.png', '2022-03-24 12:33:52.87559', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('0d7f82c0-d88c-427d-bda7-3acd36316337', 'Leanne Graham', 'sincere@april.biz', '$2b$10$oP0QuxvA5RToIgzAKCSEWeWFkDgQB3NfAdhV7AFq5BsYKYoDyAlSe', '17707368031', 'https://www.w3schools.com/howto/img_avatar2.png', '2022-03-24 12:32:49.689436', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('431103df-7f56-4778-ba72-f4f3927d3d49', 'Chelsey Dietrich', 'lucio_hettinger@annie.ca', '$2b$10$CE86PsUtp2lqq0lU.NDM0Ovtplk9BD.REJx5YrUblUR1ZB9fdljCG', '2549541289', 'https://www.w3schools.com/w3images/avatar6.png', '2022-03-24 12:38:27.528365', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('6ba03ee8-390d-4d68-a2f0-c1bf89a4c019', 'Clementine Bauch', 'nathan@yesenia.net', '$2b$10$te0pSRyonSt5cQy1DkYu3eA6tTxV.qP3Z6/PQAoyRKElI9mAXCbYe', '14631234447', 'https://www.w3schools.com/w3images/avatar5.png', '2022-03-24 12:36:34.378157', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('22d3a143-d572-40ac-8a22-f55da593f68b', 'Dennis Schulist', 'karley_dach@jasper.info', '$2b$10$6wOhWXUBmamQ1HzDvHNZ0eVL0FXhHr0fOQS.36BasDz/LUbt0T60a', '14779358478', 'https://www.w3schools.com/w3images/avatar2.png', '2022-03-25 06:02:47.991631', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('7bc9551f-97f0-4aab-9af8-0fc4c3422f80', 'Patricia Lebsack', 'julianne.oconner@kory.org', '$2b$10$4cgbuokIPYITvGevDjqh7ORM1CrPMG7styEnuM9y/ncFAzewJzxAS', '4931709623', 'https://www.w3schools.com/howto/img_avatar2.png', '2022-03-24 12:37:36.521332', NULL);
INSERT INTO public.users (id, name, email, password, phone, photo, created_at, updated_at) VALUES ('0d1d2bd9-1cca-4dbe-84af-f95bea39f318', 'Kurtis Weissna', 'telly.hoeger@billy.biz', '$2b$10$hZ4/xmZk6m1cephwDtMoAucHN8V1DrhNJ/Yx.ZuHVrNhAvqcP4b3i', '2100676132', 'https://www.w3schools.com/howto/img_avatar.png', '2022-03-26 10:47:56.021628', '2022-03-26 10:49:03.916');


--
-- TOC entry 3189 (class 2606 OID 19240)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3191 (class 2606 OID 27441)
-- Name: liked_recipes liked_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liked_recipes
    ADD CONSTRAINT liked_recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 27427)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 3193 (class 2606 OID 27448)
-- Name: saved_recipes saved_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_recipes
    ADD CONSTRAINT saved_recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 3185 (class 2606 OID 19226)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2022-03-26 11:46:47

--
-- PostgreSQL database dump complete
--

