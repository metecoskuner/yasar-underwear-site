export const MAP_PLACES = [
	{
		id: 'toptan-magaza',
		title: 'Toptan Mağaza',
		lat: 41.0086,
		lng: 28.97,
		addr: 'Mahmutpaşa Camii Avlu İçi No:12/A Fatih/Istanbul',
		mapsUrl: 'https://www.google.com/maps?q=Yasar+Camasir,+Mahmutpa%C5%9Fa+Cami+Avlu+i%C3%A7i+No:+12/A,+Mahmutpa%C5%9Fa+Yk%C5%9F.+Sk.,+34120,+T%C3%BCrkiye&ftid=0x14caa563cff9b7c9:0x892026ca3f79739e&entry=gps&shh=CAE&lucs=,94259551,94297699,100808508,100794546,94284496,94231188,94280568,47071704,94218641,94282134,100799877,94286869&g_ep=CAISEjI2LjEzLjYuODg4MzU5NjE4MBgAIIgnKm8sOTQyNTk1NTEsOTQyOTc2OTksMTAwODA4NTA4LDEwMDc5NDU0Niw5NDI4NDQ5Niw5NDIzMTE4OCw5NDI4MDU2OCw0NzA3MTcwNCw5NDIxODY0MSw5NDI4MjEzNCwxMDA3OTk4NzcsOTQyODY4NjlCAklF&skid=8dcef658-1ba7-4dac-9dec-f3ef8bdd396f&g_st=iw'
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
