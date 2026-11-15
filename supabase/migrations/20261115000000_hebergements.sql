-- Places to stay listed on the Où dormir page. One row per place; the
-- section titles and the on-site château block stay in the front-end code.
create table public.hebergements (
  id bigint generated always as identity primary key,
  category text not null check (category in ('proche', 'agritourisme', 'chic')),
  sort_order integer not null default 0,
  name text not null,
  url text,
  place text,
  drive text,
  rooms text,
  price text,
  estimated boolean not null default false,
  note text,
  phones text[] not null default '{}',
  email text,
  visible boolean not null default true
);

alter table public.hebergements enable row level security;

-- Read-only for the public site; rows are edited from the Supabase dashboard.
revoke all on public.hebergements from anon, authenticated;
grant select on public.hebergements to anon;

create policy "visible hebergements are publicly readable"
  on public.hebergements for select
  to anon
  using (visible);

insert into public.hebergements
  (category, sort_order, name, url, place, drive, rooms, price, estimated, note, phones, email)
values
  ('proche', 10, 'Albergo Ristorante Da Tunon', 'https://www.kayak.com/Oviglio-Hotels-Albergo-ristorante-Da-Tunon.3837690.ksp', 'Oviglio, Via Dante 4', '5 min à pied', '8', '≈ 85–100 €', false, 'Hôtel 2★ avec restaurant, chambres simples et triples. Très bien noté.', array['+39 0131 776218'], null),
  ('proche', 20, 'B&B Castello di Monvicino', null, 'Oviglio, Cascina Monvicino', '4 min · 2 km', '≈ 3', '≈ 60–100 €', false, 'B&B dans une ferme historique, parking gratuit.', array['+39 0131 799907', '+39 348 310 7593'], null),
  ('proche', 30, 'Hotel Europa', 'https://initalia.it/en/hotel/hoteleuropaalessandria.htm', 'Alessandria, Via Palestro 1', '17 min · 14 km', null, '≈ 85–110 €', false, '3★ en centre-ville, à 10 min à pied de la gare, garage privé. Pratique sans voiture la veille.', '{}', null),
  ('proche', 40, 'Colle Aperto B&B', 'https://nz.trip.com/hotels/quargnento-hotel-detail-22954945/colle-aperto-bed-and-breakfast', 'Quargnento, Strada Vallerina 12', '20 min · 16 km', null, '≈ 65–120 €', true, 'B&B dans les collines du Monferrato.', array['+39 335 677 2386', '+39 0131 519010'], null),
  ('proche', 50, 'Hotel Belvedere', 'https://www.kayak.com/Alice-Bel-Colle-Hotels-Hotel-Belvedere.372313.ksp', 'Alice Bel Colle', '30 min · 22 km', null, '≈ 60–90 €', false, 'Hôtel 3★ avec restaurant dans un village viticole.', array['+39 391 447 4300'], null),
  ('agritourisme', 10, 'Agriturismo Amarant', 'https://www.agriturismi.it/it/piemonte/bergamasco/agriturismo_amarant.html', 'Bergamasco, Regione Franchigie 17', '10 min · 6 km', '4 (12 lits)', '≈ 60–135 €', false, 'Piscine, restaurant, animaux de la ferme. Chambres familiales.', array['+39 0131 776082', '+39 338 637 0314'], null),
  ('agritourisme', 20, 'Agriturismo Olivazzi', 'https://www.agriturismo.it/en/farmhouse/piedmont/alessandria/Olivazzi-6391523/index.html', 'Quattordio', '14 min · 11 km', null, '≈ 75–100 €', false, 'Chambres doubles et appartements avec cuisine, climatisés. Bien pour les familles.', '{}', null),
  ('agritourisme', 30, 'I Vigneti del Mandorlo', 'https://www.kayak.co.uk/Mombaruzzo-Hotels-I-Vigneti-Del-Mandorlo.378657.ksp', 'Mombaruzzo, Via Bella Parancone 7', '19 min · 14 km', null, '≈ 80–120 €', true, 'Domaine viticole avec restaurant, vin maison, grandes chambres calmes.', array['+39 0141 774541', '+39 348 681 0154'], null),
  ('agritourisme', 40, 'Quadrifoglio Alpaca', 'https://agriturismo.it/en/farmhouse/piedmont/alessandria/QuadrifoglioAlpaca-8861167/index.html', 'Quargnento, Strada Vallerina 15/A', '20 min · 16 km', '5 (15 pers.)', '≈ 65–120 €', true, 'B&B à la ferme… avec des alpagas. Très bien noté.', '{}', null),
  ('agritourisme', 50, 'Tenuta La Romana', 'https://www.agriturismi.it/it/piemonte/nizza_monferrato/agriturismo_tenuta_la_romana.html', 'Nizza Monferrato', '23 min · 23 km', '20', 'dès ≈ 100 €', false, 'Le plus grand agritourisme de la liste : chambres et petits appartements.', '{}', null),
  ('agritourisme', 60, 'Agriturismo Cascinotta', null, 'Castelceriolo (Alessandria), Via Villanova 3', '24 min · 21 km', null, '≈ 65–100 €', true, 'Ferme aux portes d’Alessandria.', array['+39 351 560 8575'], 'cascinotta@agricascinotta.it'),
  ('agritourisme', 70, 'La Mussia', 'https://www.agriturismi.it/it/piemonte/castelnuovo_calcea/agriturismo_la_mussia.html', 'Castelnuovo Calcea', '27 min · 24 km', '8 + 4 apparts', 'dès ≈ 110 €', false, 'Piscine, au cœur des vignes de Barbera.', '{}', null),
  ('chic', 10, 'La Villa Hotel', 'https://guide.michelin.com/en/hotels-stays/mombaruzzo/la-villa-hotel-9640', 'Mombaruzzo', '19 min · 14 km', '15', '≈ 230–300 €', false, 'Palazzo du XVIIe siècle entouré de vignes, piscine panoramique, restaurant. Sélectionné par le Guide Michelin.', '{}', null),
  ('chic', 20, 'Relais Villa Prato', 'https://www.expedia.com/Mombaruzzo-Hotels-Relais-Villa-Prato.h39815117.Hotel-Information', 'Mombaruzzo', '19 min · 14 km', '14', '≈ 210–260 €', false, 'Villa historique 5★ avec spa, restaurant et cave.', '{}', null),
  ('chic', 30, 'Relais Almaranto', 'https://guide.michelin.com/it/it/hotels-stays/calamandrana/almaranto-hotel-retreat-12221', 'Calamandrana', '28 min · 27 km', '23', '≈ 180–250 €', false, 'Relais design au milieu des vignes du Nizza, dont 4 suites. Organise des dégustations.', '{}', null),
  ('chic', 40, 'Villa Fontana Relais Suite & Spa', 'https://www.villafontanaaglianoterme.it/en/', 'Agliano Terme, Via Mazzini 69/73', '30 min · 28 km', '12 suites', '≈ 250–350 €', false, 'Deux villas historiques restaurées, parc avec piscines, spa et restaurant.', array['+39 0141 964031'], 'info@villafontanaaglianoterme.it'),
  ('chic', 50, 'Grand Hotel Nuove Terme', 'https://www.initalia.it/en/hotel/grandhotelnuoveterme.htm', 'Acqui Terme', '34 min · 31 km', '142', '≈ 100–150 €', false, 'Grand hôtel 4★ Liberty de 1891, spa thermal. Idéal pour loger un groupe au même endroit.', '{}', null);
