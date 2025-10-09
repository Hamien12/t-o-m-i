// ==========================
// SHOP PAGE FUNCTIONALITY
// ==========================

class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            categories: [],
            colors: [],
            priceRange: { min: 0, max: 2000000 }, // VND
            rating: null,
            occasions: [],
            search: ''
        };
        
        this.init();
    }

    init() {
        this.generateProducts();
        this.bindEvents();
        this.renderProducts();
        this.updateResultsCount();
    }

    generateProducts() {
        // Dữ liệu sản phẩm từ Excel
        const excelData = [
            {"STT": 1, "Mã sản phẩm": "DR210", "Phân loại ": "Hoa bó", "Ý nghĩa": "https://kodo.vn/y-nghia-cac-loai-hoa/", "Unnamed: 4": "Hoa hồng vàng, cúc mẫu đơn cam nhạt, baby trắng, hoa thạch thảo", "Giá": 150.0},
            {"STT": 2, "Mã sản phẩm": "DR276", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa lưu ly xanh, baby trắng, lá bạc", "Giá": 150.0},
            {"STT": 3, "Mã sản phẩm": "DR150", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa đồng tiền hồng pastel, hoa hồng phấn, cúc họa mi trắng, lá phụ xanh.", "Giá": 200.0},
            {"STT": 4, "Mã sản phẩm": "DR252", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Thược dược hồng cam, hoa hồng pastel, đồng tiền hồng nhạt, hoa ly trắng, cỏ pampas.", "Giá": 250.0},
            {"STT": 5, "Mã sản phẩm": "DR261", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cẩm tú cầu xanh, lá bạch đàn", "Giá": 250.0},
            {"STT": 6, "Mã sản phẩm": "DR636", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng đỏ, cúc họa mi, lá phụ xanh", "Giá": 250.0},
            {"STT": 7, "Mã sản phẩm": "DR296", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip hồng pastel", "Giá": 200.0},
            {"STT": 8, "Mã sản phẩm": "DR901", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa cúc họa mi trắng, mao lương cam và hồng nhạt, tulip vàng, baby xanh", "Giá": 300.0},
            {"STT": 9, "Mã sản phẩm": "NT358", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cẩm chướng trắng, hoa đồng tiền hồng nhạt, hoa thanh tú xanh nhạt, hoa calla trắng", "Giá": 450.0},
            {"STT": 10, "Mã sản phẩm": "NT448", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc mẫu đơn cam, thược dược vàng, hoa cúc tây, baby trắng, lá xanh", "Giá": 600.0},
            {"STT": 11, "Mã sản phẩm": "NT729", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng phấn, đồng tiền hồng nhạt, baby trắng, cúc họa mi", "Giá": 700.0},
            {"STT": 12, "Mã sản phẩm": "NT426", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng kem, hồng pastel, cẩm chướng hồng, hoa lan mini", "Giá": 600.0},
            {"STT": 13, "Mã sản phẩm": "NT792", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Đồng tiền tím, hồng tím pastel, baby trắng, cúc tây tím, lá bạc", "Giá": 400.0},
            {"STT": 14, "Mã sản phẩm": "NT412", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng tím, cẩm chướng tím, baby trắng, hoa ly, lan tường", "Giá": 700.0},
            {"STT": 15, "Mã sản phẩm": "NT840", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly trắng kép, lá phụ xanh nhạt", "Giá": 600.0},
            {"STT": 16, "Mã sản phẩm": "NT237", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc mẫu đơn vàng, hồng kem, hoa bi trắng, lá bạc", "Giá": 500.0},
            {"STT": 17, "Mã sản phẩm": "NT209", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip cam, hồng đỏ cam, lá bạc", "Giá": 400.0},
            {"STT": 18, "Mã sản phẩm": "NT113", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng phấn, cúc mẫu đơn hồng, đồng tiền trắng, baby trắng", "Giá": 350.0},
            {"STT": 19, "Mã sản phẩm": "NT386", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Tulip hồng pastel, hoa hồng phấn, cúc họa mi trắng", "Giá": 500.0},
            {"STT": 20, "Mã sản phẩm": "NT741", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc vàng, hồng cam, thược dược vàng, baby trắng", "Giá": 500.0},
            {"STT": 21, "Mã sản phẩm": "NT210", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng đỏ, cẩm chướng kem, baby trắng, lá bạc", "Giá": 400.0},
            {"STT": 22, "Mã sản phẩm": "NT546", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa thược dược hồng, hoa lan trắng, hồng pastel, calla trắng", "Giá": 700.0},
            {"STT": 23, "Mã sản phẩm": "EL111", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly hồng, hoa hồng pastel, baby trắng, lá phụ xanh", "Giá": 500.0},
            {"STT": 24, "Mã sản phẩm": "EL222", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly hồng pastel, cẩm chướng trắng, baby trắng, lá bạc", "Giá": 600.0},
            {"STT": 25, "Mã sản phẩm": "EL333", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp trắng, hoa hồng kem, hồng pastel, cẩm chướng hồng, calla trắng, baby trắng", "Giá": 700.0},
            {"STT": 26, "Mã sản phẩm": "EL444", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa cẩm tú cầu xanh, baby trắng, lá bạch đàn", "Giá": 800.0},
            {"STT": 27, "Mã sản phẩm": "EL555", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng tím, cẩm tú cầu xanh tím, lan tím, baby trắng, lá phụ xanh", "Giá": 650.0},
            {"STT": 28, "Mã sản phẩm": "MD666", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan mokara hồng, lan hồ điệp, lá bạc", "Giá": 6000.0},
            {"STT": 29, "Mã sản phẩm": "MD448", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng đỏ, cẩm chướng hồng, nhài Clematis trắng, lan hồ điệp trắng, lá phụ xanh", "Giá": 8200.0},
            {"STT": 30, "Mã sản phẩm": "MD731", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lily, tulip, hoa hồng, cẩm chướng nhỏ, lá bạc", "Giá": 2000.0},
            {"STT": 31, "Mã sản phẩm": "MD572", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa rum, hoa hồng, lan hồ điệp trắng, cúc mẫu đơn vàng, lan vũ nữ nhỏ, lá phụ ", "Giá": 4000.0},
            {"STT": 32, "Mã sản phẩm": "MD361", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": " tulip vàng, cúc đồng tiền vàng, thược dược, lan hồ điệp, lan vũ nữ, lan mokara, hoa nhài", "Giá": 2000.0},
            {"STT": 33, "Mã sản phẩm": "MD210", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hướng dương, hoa hồng vàng, cúc mẫu đơn vàng nhạt", "Giá": 1200.0},
            {"STT": 34, "Mã sản phẩm": "MD471", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa mẫu đơn hồng, hoa anh đào, hoa lan hồng, hoa hồng pastel", "Giá": 1000.0},
            {"STT": 35, "Mã sản phẩm": "MD900", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp trắng – tím, hoa hồng , hoa mao lương", "Giá": 4800.0},
            {"STT": 36, "Mã sản phẩm": "MD520", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa cúc mẫu đơn xanh nhạt, hoa hồng đào, hoa mao lương, hoa cúc xanh, lá xanh và nụ sen trang trí", "Giá": 4500.0},
            {"STT": 37, "Mã sản phẩm": "MD131", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa rum trắng, hoa cúc xanh, hoa hồng xanh nhạt", "Giá": 1000.0},
            {"STT": 38, "Mã sản phẩm": "MD682", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa sen hồng nhạt, hoa sen trắng pha hồng, nụ sen, lá sen xanh và đài sen trang trí.", "Giá": 4800.0},
            {"STT": 39, "Mã sản phẩm": "MD359", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng hồng pastel, hoa tulip hồng nhạt, hoa cúc mẫu đơn hồng, hoa baby trắng và tím nhạt, hoa cẩm chướng", "Giá": 4500.0},
            {"STT": 40, "Mã sản phẩm": "MD846", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa sen trắng, nụ sen xanh, đài sen, hoa hồng trắng, hoa cát tường trắng", "Giá": 10000.0},
            {"STT": 41, "Mã sản phẩm": "MP276", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa mẫu đơn cam, hoa hồng đỏ và hồng cam, hoa cúc ping pong vàng, hoa dahlia đỏ, hoa cúc mẫu đơn hồng", "Giá": 500.0},
            {"STT": 42, "Mã sản phẩm": "MP101", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip hồng, hoa hồng pastel, hoa mẫu đơn hồng nhạt, hoa lan mokara hồng", "Giá": 720.0},
            {"STT": 43, "Mã sản phẩm": "MP102", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa tulip trắng, hoa cúc mẫu đơn hồng nhạt, hoa cẩm chướng trắng, hoa baby trắng", "Giá": 450.0},
            {"STT": 44, "Mã sản phẩm": "MP103", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa mẫu đơn hồng, hoa cúc ping pong hồng, hoa anthurium (môn hồng), hoa cẩm chướng trắng", "Giá": 900.0},
            {"STT": 45, "Mã sản phẩm": "MP104", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng tím, hoa cát tường tím, hoa cẩm chướng tím và lá phụ xanh", "Giá": 800.0},
            {"STT": 46, "Mã sản phẩm": "MP105", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cẩm chướng, hoa mẫu đơn hồng nhạt, hoa cúc ping pong trắng, hoa lan hồ điệp trắng và lá eucalyptus xanh bạc", "Giá": 450.0},
            {"STT": 47, "Mã sản phẩm": "MP106", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa lan hồ điệp tím, hoa tulip hồng, hoa cúc mẫu đơn, hoa baby trắng", "Giá": 2000.0},
            {"STT": 48, "Mã sản phẩm": "MP107", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng xanh lá, hoa lan mokara xanh, hoa cúc ping pong xanh, hoa mao lương xanh nhạt", "Giá": 800.0},
            {"STT": 49, "Mã sản phẩm": "MP108", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cát tường trắng, hoa mẫu đơn hồng nhạt, hoa cúc mẫu đơn nhỏ", "Giá": 700.0},
            {"STT": 50, "Mã sản phẩm": "MP109", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng hồng pastel, hoa cúc mẫu đơn hồng, hoa baby trắng, hoa sao tím", "Giá": 3000.0},
            {"STT": 51, "Mã sản phẩm": "MP110", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa đồng tiền cam nhạt, hoa hồng pastel, hoa cúc họa mi nhỏ, hoa baby hồng", "Giá": 150.0},
            {"STT": 52, "Mã sản phẩm": "MP111", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng vàng, hoa hồng kem, hoa cúc mẫu đơn trắng, hoa cúc nhỏ vàng nhạt", "Giá": 500.0},
            {"STT": 53, "Mã sản phẩm": "GZ971", "Phân loại ": "Hoa hộp", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp tím, hoa baby tím", "Giá": 500.0},
            {"STT": 54, "Mã sản phẩm": "GZ630", "Phân loại ": "Hoa hộp", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng cam và hồng nhạt, hoa cẩm tú cầu xanh trắng, hoa cúc nhỏ", "Giá": 600.0},
            {"STT": 55, "Mã sản phẩm": "DESIGN", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Thiết kế đặc biệt theo yêu cầu khách hàng", "Giá": 800.0}
        ];

        // Lọc bỏ các sản phẩm không có dữ liệu
        const validProducts = excelData.filter(item => 
            item["Mã sản phẩm"] && 
            item["Mã sản phẩm"] !== "" && 
            item["Phân loại "] && 
            item["Giá"] && 
            item["Unnamed: 4"]
        );

        console.log(`Total products in Excel data: ${excelData.length}`);
        console.log(`Valid products after filtering: ${validProducts.length}`);

        this.products = validProducts.map((item, index) => {
            // Xác định category theo mã sản phẩm: DR/NT/EL -> hoabo, MD -> hoabinh, MP -> hoalang, GZ -> hopmica
            const productCode = item["Mã sản phẩm"]; 
            let category = 'hoabo';
            if (/^(MD)/i.test(productCode)) category = 'hoabinh';
            else if (/^(MP)/i.test(productCode)) category = 'hoalang';
            else if (/^(GZ)/i.test(productCode)) category = 'hopmica';
            else if (/^(DR|NT|EL)/i.test(productCode)) category = 'hoabo';

            // Xác định màu sắc từ mô tả
            let color = 'pink';
            const description = item["Unnamed: 4"].toLowerCase();
            if (description.includes('đỏ') || description.includes('red')) color = 'red';
            else if (description.includes('trắng') || description.includes('white')) color = 'white';
            else if (description.includes('vàng') || description.includes('yellow')) color = 'yellow';
            else if (description.includes('tím') || description.includes('purple')) color = 'purple';
            else if (description.includes('xanh') || description.includes('blue')) color = 'blue';
            else if (description.includes('hồng') || description.includes('pink')) color = 'pink';

            // Xác định dịp sử dụng
            let occasion = 'birthday';
            if (description.includes('cưới') || description.includes('wedding')) occasion = 'wedding';
            else if (description.includes('valentine')) occasion = 'valentine';
            else if (description.includes('mẹ') || description.includes('mother')) occasion = 'mother';
            else if (description.includes('tốt nghiệp') || description.includes('graduation')) occasion = 'graduation';
            else if (description.includes('xin lỗi') || description.includes('apology')) occasion = 'apology';

            // Sử dụng mã sản phẩm làm tên
            const name = productCode; // Tên sản phẩm = mã sản phẩm

            // Xác định đường dẫn ảnh
            let imagePath = 'image/shop/' + productCode + '.png';
            
            // Xử lý các trường hợp đặc biệt cho tên file
            if (productCode === 'EL111') {
                imagePath = 'image/shop/EL 111.png'; // Có khoảng trắng trong tên file
            } else if (productCode === 'EL222') {
                imagePath = 'image/shop/EL222.png';
            } else if (productCode === 'EL333') {
                imagePath = 'image/shop/EL333.png';
            } else if (productCode === 'EL444') {
                imagePath = 'image/shop/EL444.png';
            } else if (productCode === 'EL555') {
                imagePath = 'image/shop/EL555.png';
            } else if (productCode === 'DR150') {
                imagePath = 'image/shop/DR150.png';
            } else if (productCode === 'DR252') {
                imagePath = 'image/shop/DR252.png';
            } else if (productCode === 'DR261') {
                imagePath = 'image/shop/DR261.png';
            } else if (productCode === 'DR276') {
                imagePath = 'image/shop/DR276.png';
            } else if (productCode === 'DR296') {
                imagePath = 'image/shop/DR296.png';
            } else if (productCode === 'DR636') {
                imagePath = 'image/shop/DR636.png';
            } else if (productCode === 'DR901') {
                imagePath = 'image/shop/DR901.png';
            } else if (productCode === 'GZ630') {
                imagePath = 'image/shop/GZ630.png';
            } else if (productCode === 'GZ971') {
                imagePath = 'image/shop/GZ971.png';
            } else if (productCode === 'MD131') {
                imagePath = 'image/shop/MD131.png';
            } else if (productCode === 'MD210') {
                imagePath = 'image/shop/MD210.png';
            } else if (productCode === 'MD359') {
                imagePath = 'image/shop/MD359.png';
            } else if (productCode === 'MD361') {
                imagePath = 'image/shop/MD361.png';
            } else if (productCode === 'MD448') {
                imagePath = 'image/shop/MD448.png';
            } else if (productCode === 'MD471') {
                imagePath = 'image/shop/MD471.png';
            } else if (productCode === 'MD520') {
                imagePath = 'image/shop/MD520.png';
            } else if (productCode === 'MD572') {
                imagePath = 'image/shop/MD572.png';
            } else if (productCode === 'MD666') {
                imagePath = 'image/shop/MD666.png';
            } else if (productCode === 'MD682') {
                imagePath = 'image/shop/MD682.png';
            } else if (productCode === 'MD731') {
                imagePath = 'image/shop/MD731.png';
            } else if (productCode === 'MD846') {
                imagePath = 'image/shop/MD846.png';
            } else if (productCode === 'MD900') {
                imagePath = 'image/shop/MD900.png';
            } else if (productCode === 'MP101') {
                imagePath = 'image/shop/MP101.png';
            } else if (productCode === 'MP102') {
                imagePath = 'image/shop/MP102.png';
            } else if (productCode === 'MP103') {
                imagePath = 'image/shop/MP103.png';
            } else if (productCode === 'MP104') {
                imagePath = 'image/shop/MP104.png';
            } else if (productCode === 'MP105') {
                imagePath = 'image/shop/MP105.png';
            } else if (productCode === 'MP106') {
                imagePath = 'image/shop/MP106.png';
            } else if (productCode === 'MP107') {
                imagePath = 'image/shop/MP107.png';
            } else if (productCode === 'MP108') {
                imagePath = 'image/shop/MP108.png';
            } else if (productCode === 'MP109') {
                imagePath = 'image/shop/MP109.png';
            } else if (productCode === 'MP110') {
                imagePath = 'image/shop/MP110.png';
            } else if (productCode === 'MP111') {
                imagePath = 'image/shop/MP111.png';
            } else if (productCode === 'MP276') {
                imagePath = 'image/shop/MP276.png';
            } else if (productCode === 'NT113') {
                imagePath = 'image/shop/NT113.png';
            } else if (productCode === 'NT209') {
                imagePath = 'image/shop/NT209.png';
            } else if (productCode === 'NT210') {
                imagePath = 'image/shop/NT210.png';
            } else if (productCode === 'NT237') {
                imagePath = 'image/shop/NT237.png';
            } else if (productCode === 'NT358') {
                imagePath = 'image/shop/NT358.png';
            } else if (productCode === 'NT386') {
                imagePath = 'image/shop/NT386.png';
            } else if (productCode === 'NT412') {
                imagePath = 'image/shop/NT412.png';
            } else if (productCode === 'NT426') {
                imagePath = 'image/shop/NT426.png';
            } else if (productCode === 'NT448') {
                imagePath = 'image/shop/NT448.png';
            } else if (productCode === 'NT546') {
                imagePath = 'image/shop/NT546.png';
            } else if (productCode === 'NT729') {
                imagePath = 'image/shop/NT729.png';
            } else if (productCode === 'NT741') {
                imagePath = 'image/shop/NT741.png';
            } else if (productCode === 'NT792') {
                imagePath = 'image/shop/NT792.png';
            } else if (productCode === 'NT840') {
                imagePath = 'image/shop/NT840.png';
            } else if (productCode === 'DESIGN') {
                imagePath = 'image/shop/Thiết kế chưa có tên.png';
            } else {
                // Fallback cho các sản phẩm khác
                imagePath = 'image/shop/' + productCode + '.png';
            }

            // Encode only the filename to handle spaces & Vietnamese characters
            try {
                const pathSegments = imagePath.split('/');
                const fileName = pathSegments.pop();
                const encodedFileName = encodeURIComponent(fileName);
                imagePath = [...pathSegments, encodedFileName].join('/');
            } catch (e) {
                console.warn('Failed to encode image path, using raw path:', imagePath, e);
            }

            // Debug: Log image path
            console.log(`Generated product: ${name}, Image path: ${imagePath}`);

            return {
                id: index + 1,
                name: name,
                price: item["Giá"] * 1000, // Convert to VND
                category: category,
                color: color,
                rating: 4.0 + Math.random() * 1.0, // Random rating 4.0-5.0
                image: imagePath,
                badge: Math.random() > 0.8 ? '-10%' : null, // 20% chance of discount
                occasion: occasion,
                productCode: productCode,
                description: item["Unnamed: 4"],
                meaning: item["Ý nghĩa"],
                inStock: Math.random() > 0.1, // 90% in stock
                isNew: Math.random() > 0.7, // 30% new
                isPopular: Math.random() > 0.6 // 40% popular
            };
        });

        this.filteredProducts = [...this.products];
        console.log(`Final products created: ${this.products.length}`);
        console.log(`Filtered products: ${this.filteredProducts.length}`);
        
        // Test: Log first few products
        if (this.products.length > 0) {
            console.log('First product:', this.products[0]);
            console.log('First product image path:', this.products[0].image);
        } else {
            console.error('No products created! Creating fallback...');
            // Create a simple fallback product
            this.products = [{
                id: 1,
                name: 'DR261',
                price: 250000,
                category: 'bouquet',
                color: 'blue',
                rating: 4.5,
                image: 'image/shop/DR261.png',
                badge: null,
                occasion: 'birthday',
                productCode: 'DR261',
                description: 'Cẩm tú cầu xanh, lá bạch đàn',
                meaning: null,
                inStock: true,
                isNew: true,
                isPopular: true
            }];
            this.filteredProducts = [...this.products];
            console.log('Fallback product created:', this.products[0]);
        }
    }


    bindEvents() {
        // Filter toggle
        const filterToggle = document.querySelector('.filter-toggle');
        const filters = document.querySelector('.filters');
        
        if (filterToggle && filters) {
            filterToggle.addEventListener('click', () => {
                const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
                filterToggle.setAttribute('aria-expanded', !isExpanded);
                filters.classList.toggle('active');
            });
        }

        // Search
        const searchInput = document.getElementById('shop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Sort
        const sortSelect = document.getElementById('shop-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.renderProducts();
            });
        });

        // Category filters
        const categoryInputs = document.querySelectorAll('input[name="cat"]');
        categoryInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateCategoryFilters();
                this.applyFilters();
            });
        });

        // Color filters
        const colorChips = document.querySelectorAll('.color-chip');
        colorChips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                this.updateColorFilters();
                this.applyFilters();
            });
        });

        // Price range
        const priceSlider = document.getElementById('price-slider');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const applyPriceBtn = document.getElementById('apply-price');

        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.filters.priceRange.max = value;
                this.updatePriceDisplay();
                this.applyFilters();
            });
        }

        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', () => {
                const min = (parseInt(minPriceInput.value) || 0) * 1000; // input tính theo nghìn
                const max = (parseInt(maxPriceInput.value) || 2000) * 1000;
                this.filters.priceRange = { min, max };
                this.applyFilters();
            });
        }

        // Rating filters
        const ratingInputs = document.querySelectorAll('input[name="rating"]');
        ratingInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.filters.rating = input.value;
                this.applyFilters();
            });
        });

        // Occasion filters (optional - keep existing behavior if present)
        const occasionChips = document.querySelectorAll('.occasion-chip');
        occasionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                this.updateOccasionFilters();
                this.applyFilters();
            });
        });

        // Clear filters
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Pagination
        this.bindPaginationEvents();

        // Áp dụng filter theo hash (#hoabo, #hoabinh, #hoalang, #hopmica) và tương thích giá trị cũ
        const hashValue = (window.location.hash || '').replace('#', '').toLowerCase();
        const aliasMap = {
            'bouquet': 'hoabo',
            'basket': 'hoabinh',
            'box': 'hopmica',
            'event': 'hoalang'
        };
        const normalized = aliasMap[hashValue] || hashValue;
        if (normalized && ['hoabo','hoabinh','hoalang','hopmica'].includes(normalized)) {
            const checkbox = document.querySelector(`input[name="cat"][value="${normalized}"]`);
            if (checkbox) {
                checkbox.checked = true;
                this.updateCategoryFilters();
                this.applyFilters();
                checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    updateCategoryFilters() {
        const checkedInputs = document.querySelectorAll('input[name="cat"]:checked');
        this.filters.categories = Array.from(checkedInputs).map(input => input.value);
    }

    updateColorFilters() {
        const activeChips = document.querySelectorAll('.color-chip.active');
        this.filters.colors = Array.from(activeChips).map(chip => chip.dataset.color);
    }

    updateOccasionFilters() {
        const activeChips = document.querySelectorAll('.occasion-chip.active');
        this.filters.occasions = Array.from(activeChips).map(chip => chip.dataset.occasion);
    }

    updatePriceDisplay() {
        const priceLabels = document.querySelector('.price-labels');
        if (priceLabels) {
            const labels = priceLabels.querySelectorAll('span');
            if (labels[1]) {
                labels[1].textContent = `${this.filters.priceRange.max.toLocaleString()}đ`;
            }
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.filters.search && !product.name.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Color filter
            if (this.filters.colors.length > 0 && !this.filters.colors.includes(product.color)) {
                return false;
            }

            // Price filter
            if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                return false;
            }

            // Rating filter
            if (this.filters.rating && product.rating < parseFloat(this.filters.rating)) {
                return false;
            }

            // Occasion filter
            if (this.filters.occasions.length > 0 && !this.filters.occasions.includes(product.occasion)) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.renderPagination();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'new':
                this.filteredProducts.sort((a, b) => b.isNew - a.isNew);
                break;
            case 'popular':
            default:
                this.filteredProducts.sort((a, b) => b.isPopular - a.isPopular);
                break;
        }
        this.renderProducts();
    }

    renderProducts() {
        console.log('renderProducts called');
        const productsContainer = document.getElementById('products');
        if (!productsContainer) {
            console.error('Products container not found!');
            console.log('Available elements with id:', document.querySelectorAll('[id]'));
            return;
        }

        console.log('Products container found:', productsContainer);

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        console.log(`Rendering ${productsToShow.length} products`);
        console.log('Products to show:', productsToShow);

        if (this.currentView === 'list') {
            productsContainer.className = 'products list-view';
        } else {
            productsContainer.className = 'products';
        }

        const html = productsToShow.map(product => this.createProductCard(product)).join('');
        console.log('Generated HTML length:', html.length);
        console.log('Generated HTML preview:', html.substring(0, 200) + '...');
        productsContainer.innerHTML = html;
        
        // Test: Check if images are in DOM
        const images = productsContainer.querySelectorAll('img');
        console.log('Images found in DOM:', images.length);
        images.forEach((img, index) => {
            console.log(`Image ${index}:`, img.src, 'loaded:', img.complete);
        });

        // Ensure fallback image always displays if loading fails
        images.forEach((img) => {
            // Set a tiny delay so "src" assignment below doesn't immediately trigger error twice
            img.addEventListener('error', () => {
                if (!img.dataset.fallbackApplied) {
                    img.dataset.fallbackApplied = 'true';
                    img.src = 'image/services.png';
                }
            }, { once: false });
        });
    }

    createProductCard(product) {
        const badge = product.badge ? `<div class="badge">${product.badge}</div>` : '';
        const stockStatus = product.inStock ? '' : '<div class="out-of-stock">Hết hàng</div>';
        
        // Debug: Log product image path
        console.log(`Product: ${product.name}, Image: ${product.image}`);
        
        if (this.currentView === 'list') {
            return `
                <div class="product" data-price="${product.price}" data-cat="${product.category}" data-color="${product.color}">
                    ${badge}
                    <div class="thumb" style="background-image:url('${product.image}'); background-size:cover; background-position:center;">
                        <img src="${product.image}" alt="${product.name}" style="opacity:0; width:0; height:0; position:absolute;" onerror="this.closest('.thumb').style.backgroundImage='url(\\'image/services.png\\')'">
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <div class="meta">
                            <span class="price">${product.price.toLocaleString()}đ</span>
                            <span class="rating">★ ${product.rating.toFixed(1)}</span>
                        </div>
                        <button class="add" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                    </div>
                    ${stockStatus}
                </div>
            `;
        } else {
            return `
                <div class="product" data-price="${product.price}" data-cat="${product.category}" data-color="${product.color}">
                    ${badge}
                    <div class="thumb" style="background-image:url('${product.image}'); background-size:cover; background-position:center;">
                        <img src="${product.image}" alt="${product.name}" style="opacity:0; width:0; height:0; position:absolute;" onerror="this.closest('.thumb').style.backgroundImage='url(\\'image/services.png\\')'">
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <div class="meta">
                            <span class="price">${product.price.toLocaleString()}đ</span>
                            <span class="rating">★ ${product.rating.toFixed(1)}</span>
                        </div>
                        <button class="add" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                    </div>
                    ${stockStatus}
                </div>
            `;
        }
    }

    bindPaginationEvents() {
        const prevBtn = document.querySelector('.page.prev');
        const nextBtn = document.querySelector('.page.next');
        const pagesContainer = document.querySelector('.pages');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProducts();
                    this.renderPagination();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProducts();
                    this.renderPagination();
                }
            });
        }

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagesContainer = document.querySelector('.pages');
        const prevBtn = document.querySelector('.page.prev');
        const nextBtn = document.querySelector('.page.next');

        if (!pagesContainer) return;

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // Generate page numbers
        let pagesHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            pagesHTML += `
                <button class="page ${isActive ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        pagesContainer.innerHTML = pagesHTML;

        // Bind page number events
        const pageButtons = pagesContainer.querySelectorAll('.page[data-page]');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderProducts();
                this.renderPagination();
            });
        });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (!resultsCount) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
        const total = this.filteredProducts.length;

        resultsCount.textContent = `Hiển thị ${startIndex}-${endIndex} của ${total} sản phẩm`;
    }

    clearAllFilters() {
        // Reset filter state
        this.filters = {
            categories: [],
            colors: [],
            priceRange: { min: 0, max: 2000 },
            rating: null,
            occasions: [],
            search: ''
        };

        // Reset UI
        document.querySelectorAll('input[name="cat"]').forEach(input => input.checked = false);
        document.querySelectorAll('.color-chip').forEach(chip => chip.classList.remove('active'));
        document.querySelectorAll('.occasion-chip').forEach(chip => chip.classList.remove('active'));
        document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
        document.getElementById('shop-search').value = '';
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('price-slider').value = 1000;

        // Reset products
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.renderPagination();
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ShopManager...');
    try {
        const shopManager = new ShopManager();
        console.log('ShopManager created:', shopManager);
        console.log('Products count:', shopManager.products.length);
        console.log('Filtered products count:', shopManager.filteredProducts.length);

        // Initialize cart count from localStorage
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cartCount.textContent = cart.length;
        }
    } catch (error) {
        console.error('Error initializing ShopManager:', error);
    }
});

// Add to cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add') && !e.target.disabled) {
        e.preventDefault();
        
        // Get product info
        const productCard = e.target.closest('.product');
        const productName = productCard.querySelector('h5').textContent;
        const priceText = productCard.querySelector('.price').textContent;
        const productPrice = parseInt(priceText.replace(/\D/g, '')); // VND number
        const productImage = productCard.querySelector('.thumb').style.backgroundImage.replace(/^url\("?|"?\)$/g, '').replace(/^url\('|\'\)$/g, '');
        const product = {
            id: productName,
            name: productName,
            price: productPrice,
            image: productImage
        };
        // Persist to localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
            cartCount.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
        
        // Show success message
        showNotification(`${productName} đã được thêm vào giỏ hàng!`, 'success');
        
        // Add to cart animation
        e.target.style.background = '28a745';
        e.target.textContent = 'Đã thêm!';
        setTimeout(() => {
            e.target.style.background = '5a7c46';
            e.target.textContent = 'Thêm vào giỏ';
        }, 1500);
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '28a745' : '17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .out-of-stock {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: 600;
        z-index: 3;
    }
    
    .filters.active {
        display: block;
    }
    
    @media (max-width: 768px) {
        .filters {
            display: none;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.substring(1); // Lấy phần sau dấu #
    if (hash) {
      // Tìm checkbox có value trùng với hash (bouquet, basket, box, event)
      const checkbox = document.querySelector(`input[value="${hash}"]`);
      if (checkbox) {
        checkbox.checked = true; // Tự bật filter tương ứng
        checkbox.dispatchEvent(new Event("change"));
  
        // Cuộn đến khu vực filters để người dùng thấy rõ
        checkbox.scrollIntoView({ behavior: "smooth", block: "center" });
  
        // Làm nổi bật filter vừa chọn (thêm hiệu ứng highlight nhẹ)
        checkbox.closest("label").classList.add("highlight");
        setTimeout(() => {
          checkbox.closest("label").classList.remove("highlight");
        }, 1500);
      }
    }
  });
  