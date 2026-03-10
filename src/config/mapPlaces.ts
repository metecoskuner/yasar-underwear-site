export const MAP_PLACES = [
	{
		id: 'toptan-magaza',
		title: 'Toptan Mağaza',
		lat: 41.0086,
		lng: 28.97,
		addr: 'Mahmutpaşa Camii Avlu İçi No:12/A Fatih/Istanbul'
	},
	{
		id: 'perakende-magaza',
		title: 'Perakende Mağaza',
		lat: 41.0085,
		lng: 28.9695,
		addr: 'Mahmutpaşa Bezciler Sokak Yeni Bilecik Han Giriş Kat No:1 Fatih/Istanbul'
	},
	{
		id: 'showroom',
		title: 'Showroom',
		lat: 41.0085,
		lng: 28.9697,
		addr: 'Mahmutpaşa Bezciler Sokak Yeni Bilecik Han Kat:2 No:304 Fatih/Istanbul'
	},
	{
		id: 'workshop-kemalpasa',
		title: 'Workshop/Depo',
		lat: 41.0629,
		lng: 28.8289,
		addr: 'Kemalpaşa, Üsküp Sk. No:22 Postcode:34295 Küçükçekmece/İstanbul'
	},
	{
		id: 'workshop-bursa-29a',
		title: 'Workshop/Depo',
		lat: 40.2643,
		lng: 29.0612,
		addr: 'KURTULUŞ MAH. ADNAN MENDERES CAD. NO:29A YENİŞEHİR/BURSA'
	},
	{
		id: 'workshop-bursa-43-1',
		title: 'Workshop/Depo',
		lat: 40.2644,
		lng: 29.0613,
		addr: 'KURTULUŞ MAH. ADNAN MENDERES CAD. NO:43/1 YENİŞEHİR/BURSA'
	}
] as const;

export type MapPlace = (typeof MAP_PLACES)[number];
