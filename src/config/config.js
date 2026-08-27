const config = {
    data: {
        // Main invitation title that appears on the page
        title: "Pernikahan Eko & Ulfa",
        // Opening message/description of the invitation
        description:
            "Kami akan menikah dan mengundang Anda untuk turut merayakan momen istimewa ini.", // Nanti ini dibikin random
        // Groom's name
        groomName: "Eko Nur Prasetyo",
        // Bride's name
        brideName: "Ulfa Safitri",
        // Groom's parents names
        parentGroom: "Bapak Sulaiman & Ibu Siti Khunaifah",
        // Bride's parents names
        parentBride: "Bapak Nurohmad & Ibu Kusmiyatun",
        // Wedding date (format: YYYY-MM-DD)
        date: "2026-09-20",
        // Google Maps link for location (short clickable link)
        maps_url: "https://goo.gl/maps/7Y145NNJXNcnqqL68",
        // Google Maps embed code to display map on website
        // How to get: open Google Maps → select location → Share → Embed → copy link
        maps_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.877578639703!2d110.15579969999999!3d-7.588301600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8d90fa5ce943%3A0x833b438ba9b49c86!2sToko%20Citra%20Anugerah!5e0!3m2!1sid!2sid!4v1787714235829!5m2!1sid!2sid",
        // Event time (free format, example: "10:00 - 12:00 WIB")
        time: "13:00 WIB - Selesai",
        // Venue/building name
        location: "Kediaman Memepelai Pria",
        // Full address of the wedding venue
        address:
            "Dsn. Randusari, RT.014 / RW.007, Kel. Ngadirejo, Kec. Salaman, Kab. Magelang",
        // Image that appears when link is shared on social media
        ogImage: "",
        // Icon that appears in browser tab
        favicon: "/favicon.svg",
        // List of event agenda/schedule
        agenda: [
            {
                // First event name
                title: "Akad Nikah",
                // Event date (format: YYYY-MM-DD)
                date: "2026-09-20",
                // Start time (format: HH:MM)
                startTime: "07:00",
                // End time (format: HH:MM)
                endTime: "Selesai",
                // Event venue
                location: "Kediaman Mempelai Wanita",
                // Full address
                address:
                    "Dsn. Mangunsari, RT.07 / RW.02, Kel. Krinjing, Kec. Kajoran, Kab. Magelang",
                maps_embed:
                    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3955.66997268448!2d110.12414707500216!3d-7.501638992510797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMzAnMDUuOSJTIDExMMKwMDcnMzYuMiJF!5e0!3m2!1sid!2sid!4v1787716203067!5m2!1sid!2sid",
            },
            {
                // Second event name
                title: "Ngunduh Mantu",
                date: "2026-09-20",
                startTime: "13:00",
                endTime: "Selesai",
                location: "Kediaman Memepelai Pria",
                address:
                    "Dsn. Randusari, RT.014 / RW.007, Kel. Ngadirejo, Kec. Salaman, Kab. Magelang",
                maps_embed:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.877578639703!2d110.15579969999999!3d-7.588301600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8d90fa5ce943%3A0x833b438ba9b49c86!2sToko%20Citra%20Anugerah!5e0!3m2!1sid!2sid!4v1787714235829!5m2!1sid!2sid",
            },
            // You can add more agenda items with the same format
        ],

        // Background music settings
        audio: {
            // Music file (choose one or replace with your own file)
            src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
            // Music title to display
            title: "Fulfilling Humming", // or Nature Sound
            // Whether music plays automatically when website opens
            autoplay: true,
            // Whether music repeats continuously
            loop: true,
        },

        // List of bank accounts for digital envelope/gifts
        banks: [
            {
                // Bank name
                bank: "Bank Central Asia",
                // Account number
                accountNumber: "1222138137",
                // Account holder name (all uppercase)
                accountName: "EKO",
            },
            // {
            //   bank: "Bank Mandiri",
            //   accountNumber: "0987654321",
            //   accountName: "FULANA",
            // },
            // You can add more banks with the same format
        ],
    },
};

export default config;
