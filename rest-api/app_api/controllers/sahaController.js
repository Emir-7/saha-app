const status = (req, res) => {
    res.status(200).json({
        status: 'Saha-App API (app_api mimarisiyle) 9000 portunda aktif ve tamamen çalışıyor!',
        port: process.env.PORT || 9000
    });
};

// module.exports standart kullanımı
module.exports = {
    status
};
