window.addEventListener('load', function() {
    var apiKey = "ВАШ API КЛЮЧ ЗДЕСЬ";
    const app = new Vue({
        el: '#app',
        data: {
            inputAddress : '',
            locations : [],
        },
        methods: {
            getData: async function(event) {

                if (this.inputAddress === "") {
                    alert('Заполните поле ввода');
                    return;
                }

                this.locations = [];

                var url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${this.inputAddress}`;

                await axios.get(url)
                .then(async response => {

                    for(var i = 0; i < response['data'].response.GeoObjectCollection.featureMember.length; i++) {
                        var geoObject = response['data'].response.GeoObjectCollection.featureMember[i].GeoObject;

                        var geodata = {
                            coordinates: geoObject.Point.pos,
                            address: geoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
                        }

                        var nearMetroUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${geoObject.Point.pos}&kind=metro&results=1`;

                        await axios.get(nearMetroUrl)
                        .then(mnresponse => {

                            if(mnresponse.data.response.GeoObjectCollection.featureMember[0] === undefined) {
                                geodata.nearMetro = 'отсутствует';                              
                                
                            } else {
                                var nearMetroData = `${mnresponse.data.response.GeoObjectCollection.featureMember[0].GeoObject.name}, ${mnresponse.data.response.GeoObjectCollection.featureMember[0].GeoObject.description}`;
                                geodata.nearMetro = nearMetroData;
                            }
                        })

                        this.locations.push(geodata);   
                    
                    }                    
                })
            }
        }
    })
})