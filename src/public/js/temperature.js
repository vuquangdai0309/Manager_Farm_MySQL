

const apiKey = '1a7d4e04a4c8cd82d300b88290d8c54a'; // Thay YOUR_API_KEY bằng API key của bạn


const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const searchInput = document.getElementById("searchInput")
const CityList = document.getElementById("CityList");
const CityAllList = document.getElementById("CityList");
const listItem = document.createElement("li");
const MAX_DISPLAY_PRODUCTS = 5
const Citys = [
    { name: 'Hà Nội', value: 'ha noi' },
    { name: 'Hồ Chí Minh', value: 'ho chi minh' },
    { name: 'Hải Phòng', value: 'haiphong' },
    { name: 'Đà Nẵng', value: 'da nang' },
    { name: 'Cần Thơ', value: 'can tho' },
    { name: 'An Giang', value: 'an giang' },
    { name: 'Bà Rịa - Vũng Tàu', value: 'ba ria vung tau' },
    { name: 'Bắc Giang', value: 'bac giang' },
    { name: 'Bắc Kạn', value: 'bac kan' },
    { name: 'Bạc Liêu', value: 'bac lieu' },
    { name: 'Bắc Ninh', value: 'bac ninh' },
    { name: 'Bến Tre', value: 'ben tre' },
    { name: 'Bình Định', value: 'binh dinh' },
    { name: 'Bình Dương', value: 'binh duong' },
    { name: 'Bình Phước', value: 'binh phuoc' },
    { name: 'Bình Thuận', value: 'binh thuan' },
    { name: 'Cà Mau', value: 'ca mau' },
    { name: 'Cao Bằng', value: 'cao bang' },
    { name: 'Đắk Lắk', value: 'dak lak' },
    { name: 'Đắk Nông', value: 'dak nong' },
    { name: 'Điện Biên', value: 'Dien Bien' },
    { name: 'Đồng Nai', value: 'dong nai' },
    { name: 'Đồng Tháp', value: 'dong thap' },
    { name: 'Gia Lai', value: 'gia lai' },
    { name: 'Hà Giang', value: 'ha giang' },
    { name: 'Hà Nam', value: 'ha nam' },
    { name: 'Hà Tĩnh', value: 'ha tinh' },
    { name: 'Hải Dương', value: 'hai duong' },
    { name: 'Hậu Giang', value: 'hau giang' },
    { name: 'Hòa Bình', value: 'hoa binh' },
    { name: 'Hưng Yên', value: 'hung yen' },
    { name: 'Khánh Hòa', value: 'khanh hoa' },
    { name: 'Kiên Giang', value: 'kien giang' },
    { name: 'Kon Tum', value: 'kon tum' },
    { name: 'Lai Châu', value: 'lai chau' },
    { name: 'Lâm Đồng', value: 'lam dong' },
    { name: 'Lạng Sơn', value: 'lang son' },
    { name: 'Lào Cai', value: 'lao cai' },
    { name: 'Long An', value: 'long an' },
    { name: 'Nam Định', value: 'nam dinh' },
    { name: 'Nghệ An', value: 'nghe an' },
    { name: 'Ninh Bình', value: 'ninh binh' },
    { name: 'Ninh Thuận', value: 'ninh thuan' },
    { name: 'Phú Thọ', value: 'phu tho' },
    { name: 'Phú Yên', value: 'phu yen' },
    { name: 'Quảng Bình', value: 'quang binh' },
    { name: 'Quảng Nam', value: 'quang nam' },
    { name: 'Quảng Ngãi', value: 'quang ngai' },
    { name: 'Quảng Ninh', value: 'quang ninh' },
    { name: 'Quảng Trị', value: 'quang tri' },
    { name: 'Sóc Trăng', value: 'soc trang' },
    { name: 'Sơn La', value: 'son la' },
    { name: 'Tây Ninh', value: 'tay ninh' },
    { name: 'Thái Bình', value: 'thai binh' },
    { name: 'Thái Nguyên', value: 'thai nguyen' },
    { name: 'Thanh Hóa', value: 'thanh hoa' },
    { name: 'Thừa Thiên Huế', value: 'thua thien hue' },
    { name: 'Tiền Giang', value: 'tien giang' },
    { name: 'Trà Vinh', value: 'tra vinh' },
    { name: 'Tuyên Quang', value: 'tuyen quang' },
    { name: 'Vĩnh Long', value: 'vinh long' },
    { name: 'Vĩnh Phúc', value: 'vinh phuc' },
    { name: 'Yên Bái', value: 'yen bai' },
];

function searchCitys() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredCitys = Citys.filter(City => City.name.toLowerCase().includes(searchTerm));
    const slicedProducts = filteredCitys.slice(0, MAX_DISPLAY_PRODUCTS);


    displayCitys(slicedProducts);
    if (searchInput.value === '') {
        CityList.innerHTML = '';
    }
}
function displayCitys(CitysToShow) {
    CityList.innerHTML = '';

    CitysToShow.forEach(City => {
        displayCity(City);
    });

}
function displayCity(City) {

    listItem.className = "CityItem";
    listItem.textContent = `${City.name} `;
    listItem.onclick = () => getCityvalue(City.name, City.value);
    CityAllList.appendChild(listItem);
}

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: `Nhiệt độ`,
            data: [],
            fill: false,
            borderColor: 'red',
        }]
    },
    options: {
        animations: {
            // tension: {
            //     duration: 1000,
            //     easing: 'linear',
            //     from: 1,
            //     to: 0,
            //     loop: true
            // }
        },
        scales: {
            y: {
                barPercentage: 0.5
            }
        }
    }
})
const humidity = document.getElementById('HumidtyChart');
const HumidtyChart = new Chart(humidity, {
    type: 'bar',
    data: {
        axis: 'y',
        labels: [],
        datasets: [{
            label: 'Độ ẩm theo % ',
            data: [],
            fill: false,
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgb(54, 162, 235)',
            ],
            borderWidth: 1
        }]
    },
});

//load dữ liệu từ local 
const getData = JSON.parse(localStorage.getItem('myArray'))
getCityvalue(getData[0].CityName, getData[0].Cityvalue)


function getCityvalue(CityName, Cityvalue) {
    CityList.innerHTML = '';
    const ArrayData = [{
        Cityvalue: Cityvalue,
        CityName: CityName,
    }]
    localStorage.setItem('myArray', JSON.stringify(ArrayData));
    const getData = JSON.parse(localStorage.getItem('myArray'))
    const city = getData[0].Cityvalue;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    // lấy thời tiết theo ngày hiện tại
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            const ShowCity = document.getElementById('city')
            const ShowTemperature = document.getElementById('temperature')
            const ShowHumidity = document.getElementById('humidity')
            const ShowWindSpeed = document.getElementById('windSpeed')
            const ShowDay = document.getElementById('weatherDay')
            const ShowTitleTemperature = document.getElementById('chartTemperature')
            // Lấy thông tin thời tiết từ dữ liệu nhận được
            const temperatureKelvin = data.main.temp;

            // Đổi nhiệt độ từ độ K sang độ C
            const temperatureCelsius = temperatureKelvin - 273.15;

            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;


            const timestamp = data.dt * 1000; // Đổi đơn vị từ giây sang mili giây
            const date = new Date(timestamp);

            // Lấy ngày và giờ từ đối tượng Date
            const day = date.toLocaleDateString();
            const weatherDescription = data.weather[0].description;
            //lưu dữ liệu vào mảng

            localStorage.setItem('myArray', JSON.stringify(ArrayData));
            const getData = JSON.parse(localStorage.getItem('myArray'))

            console.log(CityName)
            // Hiển thị thông tin thời tiết
            ShowCity.textContent = CityName
            ShowTemperature.textContent = ` ${temperatureCelsius.toFixed(2)}°C`
            ShowHumidity.textContent = `${humidity}%`
            ShowWindSpeed.textContent = `${windSpeed} m/s`
            ShowDay.textContent = `Thời tiết trong ngày ${day}`
            ShowTitleTemperature.textContent = `Nhiệt độ của ${CityName}`
            // console.log(`Nhiệt độ: ${temperatureCelsius.toFixed(2)}°C`);
            // console.log(`Độ ẩm: ${humidity}%`); 2
            // console.log(`Tốc độ gió: ${windSpeed} m/s`);
            // console.log(`Ngày: ${day}`);
            // console.log(`Thời tiết: ${weatherDescription}`);
            const unsplashAccessKey = 'x9GsYXQ6GQJf-OI2eZ4tngCqTHHd-iM_iTL1Vs0jD4U'; // Thay YOUR_UNSPLASH_ACCESS_KEY bằng Access Key của bạn

            const weatherDescriptionImg = weatherDescription
            // Gọi hàm để lấy hình ảnh từ Unsplash
            getWeatherImage(weatherDescriptionImg);

            function getWeatherImage(weatherDescription) {
                const apiUrl = `https://api.unsplash.com/photos/random?query=${weatherDescription}&client_id=${unsplashAccessKey}`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        displayImage(data.urls.regular);
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                        displayDefaultImage(); // Hiển thị hình ảnh mặc định nếu có lỗi
                    });
            }

            function displayImage(imageUrl) {
                const imageContainer = document.getElementById('image-container');
                imageContainer.innerHTML = ''; // Xóa nội dung cũ
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = 'Weather Image';
                imageContainer.appendChild(imageElement);
            }

            function displayDefaultImage() {
                // Hiển thị hình ảnh mặc định khi có lỗi hoặc không tìm thấy ảnh
                const imageContainer = document.getElementById('image-container');
                imageContainer.innerHTML = '';
                const defaultImageElement = document.createElement('img');
                // Thay đổi đường dẫn tới ảnh mặc định của bạn
                defaultImageElement.src = '/img/weather.jpg';
                imageContainer.appendChild(defaultImageElement);
            }

        })
        .catch(error => console.error('Lỗi khi lấy thông tin thời tiết:', error));
    fetch(url)
        .then(response => response.json())
        .then(data => {

            const listTemperatures = []
            const listDay = []
            const listAllDays = []
            const listHumidty = []
            // Lấy danh sách các mốc thời gian và thông tin thời tiết
            const weatherData = data.list;
            // Lặp qua danh sách thông tin thời tiết và hiển thị thông tin cho mỗi ngày
            const weatherByDay = {};
            weatherData.forEach((data) => {
                const date = new Date(data.dt * 1000);
                const dayOfWeek = daysOfWeek[date.getDay()];

                if (!weatherByDay[dayOfWeek]) {
                    weatherByDay[dayOfWeek] = [];
                }

                weatherByDay[dayOfWeek].push({
                    time: new Date(data.dt * 1000),
                    temperature: data.main.temp,
                });
            });
            // Lấy danh sách thông tin về độ ẩm cho mỗi 3 giờ
            const humidityDataList = data.list.map(item => ({
                date: item.dt_txt.split(' ')[0],
                humidity: item.main.humidity
            }));
            // Lọc danh sách để chỉ lấy thông tin độ ẩm cho 6 ngày tiếp theo
            const nextSixDaysHumidity = humidityDataList.filter((item, index, self) =>
                index === self.findIndex(i => (
                    i.date === item.date
                ))
            );
            nextSixDaysHumidity.forEach(item => {
                listAllDays.push(item.date)
                listHumidty.push(item.humidity)
            });

            // In thông tin nhiệt độ cho từng ngày
            for (const day in weatherByDay) {
                const temperatures = weatherByDay[day].map((entry) => entry.temperature);
                const avgTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
                nhietdoTB = parseFloat(avgTemperature.toFixed(2))
                listDay.push(day)
                listTemperatures.push(nhietdoTB)
            }
            myChart.data.labels = listDay
            myChart.data.datasets[0].data = listTemperatures;
            myChart.update();

            // thay đổi humidity
            HumidtyChart.data.labels = listAllDays
            HumidtyChart.data.datasets[0].data = listHumidty
            HumidtyChart.update()

        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}