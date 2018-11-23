import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';

const all_font_names = new Set(["Roboto", "Open Sans", "Lato", "Montserrat", "Roboto Condensed", "Oswald", "Source Sans Pro", "Raleway", "Slabo 27px", "Merriweather", "PT Sans", "Roboto Slab", "Noto Sans", "Ubuntu", "Poppins", "Open Sans Condensed", "Playfair Display", "Roboto Mono", "Lora", "PT Serif", "Muli", "Titillium Web", "PT Sans Narrow", "Nunito", "Arimo", "Fira Sans", "Mukta", "Nanum Gothic", "Rubik", "Work Sans", "Noto Serif", "Dosis", "Inconsolata", "Quicksand", "Crimson Text", "Hind", "Oxygen", "Libre Baskerville", "Indie Flower", "Bitter", "Anton", "Cabin", "Josefin Sans", "Fjalla One", "Noto Sans KR", "Libre Franklin", "Exo 2", "Nunito Sans", "Arvo", "Karla", "Lobster", "Signika", "Pacifico", "Varela Round", "Noto Sans JP", "Abel", "Dancing Script", "Shadows Into Light", "Yanone Kaffeesatz", "Merriweather Sans", "Bree Serif", "Acme", "Source Serif Pro", "Abril Fatface", "Amatic SC", "Archivo Narrow", "Catamaran", "Asap", "Exo", "Comfortaa", "Questrial", "Encode Sans Condensed", "Cairo", "Source Code Pro", "Hind Siliguri", "Ubuntu Condensed", "EB Garamond", "Patrick Hand", "Kanit", "Crete Round", "Gloria Hallelujah", "Righteous", "Teko", "Heebo", "Permanent Marker", "Maven Pro", "Play", "Hind Madurai", "Francois One", "Rajdhani", "Patua One", "Cuprum", "Alegreya", "Rokkitt", "PT Sans Caption", "Assistant", "Cinzel", "Noto Sans TC", "Fira Sans Condensed", "Vollkorn", "Ropa Sans", "Domine", "Orbitron", "Black Han Sans", "Old Standard TT", "Courgette", "Cantarell", "Noticia Text", "Alegreya Sans", "Cardo", "Archivo Black", "Great Vibes", "Cormorant Garamond", "ABeeZee", "Kaushan Script", "Pathway Gothic One", "Prompt", "News Cycle", "Quattrocento Sans", "Barlow", "Amiri", "Satisfy", "Fredoka One", "Cookie", "Tinos", "Kalam", "Nanum Myeongjo", "Caveat", "Alfa Slab One", "Poiret One", "Lobster Two", "Yantramanav", "Arapey", "Volkhov", "Istok Web", "Concert One", "Monda", "Ultra", "Pontano Sans", "Tangerine", "Barlow Condensed", "Chivo", "Passion One", "Russo One", "Sacramento", "BenchNine", "Didact Gothic", "Josefin Slab", "Gudea", "Quattrocento", "Playfair Display SC", "Handlee", "Sanchez", "Monoton", "Marck Script", "Khand", "Cabin Condensed", "Hind Vadodara", "Philosopher", "Economica", "Zilla Slab", "Fira Sans Extra Condensed", "IBM Plex Sans", "Vidaloka", "Sigmar One", "Armata", "Sorts Mill Goudy", "Hammersmith One", "Bangers", "Boogaloo", "Overpass", "Hind Guntur", "M PLUS 1p", "Luckiest Guy", "Amaranth", "Audiowide", "Changa", "Martel", "Merienda", "Signika Negative", "Ruda", "Neuton", "Caveat Brush", "Glegoo", "Prata", "Unica One", "Montserrat Alternates", "Neucha", "Pragati Narrow", "Architects Daughter", "Frank Ruhl Libre", "Advent Pro", "Shadows Into Light Two", "Covered By Your Grace", "PT Mono", "Gentium Basic", "Taviraj", "Yellowtail", "Lalezar", "Enriqueta", "Carter One", "Alice", "Bad Script", "Gentium Book Basic", "Parisienne", "Sarala", "Sawarabi Mincho", "Yrsa", "Adamina", "Paytone One", "Kreon", "Sintony", "Varela", "Barlow Semi Condensed", "PT Serif Caption", "Antic Slab", "Rock Salt", "Jura", "Homemade Apple", "Rambla", "Special Elite", "Cabin Sketch", "Tajawal", "Karma", "VT323", "Julius Sans One", "Arbutus Slab", "Khula", "Press Start 2P", "Aldrich", "Scada", "Oleo Script", "Playball", "Damion", "Titan One", "Allura", "Actor", "Gochi Hand", "Nothing You Could Do", "Ubuntu Mono", "Chelsea Market", "Alegreya Sans SC", "El Messiri", "Electrolize", "Michroma", "Unna", "Chewy", "Bevan", "Molengo", "Archivo", "Marmelad", "Cantata One", "Spinnaker", "Black Ops One", "Cormorant", "Prosto One", "Allerta", "Alex Brush", "Lusitana", "Mr Dafoe", "Rochester", "Nobile", "Secular One", "Hanuman", "Just Another Hand", "Fugaz One", "Eczar", "Overlock", "Rancho", "Viga", "Saira", "Saira Extra Condensed", "Baloo", "Fredericka the Great", "Quantico", "Shrikhand", "Reenie Beanie", "Carrois Gothic", "Rasa", "Grand Hotel", "Knewave", "Lustria", "Coda", "Oranienbaum", "Magra", "Kameron", "Basic", "Pridi", "Nanum Gothic Coding", "Bowlby One SC", "Marcellus", "Squada One", "Tenor Sans", "Syncopate", "Radley", "Pinyon Script", "Noto Sans SC", "Coming Soon", "Forum", "Italianno", "Palanquin", "Nanum Pen Script", "Gothic A1", "Leckerli One", "Halant", "Niconne", "Carme", "Days One", "Alef", "Jaldi", "Candal", "Lilita One", "Saira Semi Condensed", "Antic", "Scheherazade", "Anaheim", "Fauna One", "Biryani", "Mukta Vaani", "Aclonica", "Spectral", "Asap Condensed", "Changa One", "Mitr", "Allerta Stencil", "Sawarabi Gothic", "Berkshire Swash", "Arsenal", "Share", "Cousine", "Buenard", "Lateef", "Martel Sans", "Marcellus SC", "Duru Sans", "Pangolin", "Space Mono", "Coda Caption", "Marvel", "Doppio One", "Abhaya Libre", "Norican", "Reem Kufi", "Share Tech Mono", "Telex", "Ceviche One", "Contrail One", "Lekton", "Freckle Face", "Average", "Slabo 13px", "Rosario", "Gruppo", "Ovo", "Yeseva One", "Rufina", "Anonymous Pro", "Voltaire", "Kurale", "Coustard", "Judson", "Caudex", "IM Fell Double Pica", "Saira Condensed", "Nixie One", "Petit Formal Script", "GFS Didot", "Arima Madurai", "Copse", "Metrophobic", "Miriam Libre", "Bungee Inline", "Goudy Bookletter 1911", "Nanum Brush Script", "Shojumaru", "Annie Use Your Telescope", "Palanquin Dark", "Belleza", "Londrina Solid", "Itim", "Hanalei Fill", "Puritan", "Alegreya SC", "IBM Plex Serif", "Limelight", "Cinzel Decorative", "Jockey One", "Fira Mono", "Racing Sans One", "Sunflower", "Mada", "Aladin", "Calligraffitti", "Gilda Display", "Rozha One", "Amethysta", "Average Sans", "Baloo Bhaijaan", "Tauri", "Cutive", "Spicy Rice", "Raleway Dots", "Homenaje", "Skranji", "Yesteryear", "Delius", "Bubblegum Sans", "Markazi Text", "Love Ya Like A Sister", "Cambo", "Pattaya", "Schoolbell", "Corben", "Six Caps", "Gravitas One", "Faster One", "Bungee", "Cedarville Cursive", "Unkempt", "Inder", "Sue Ellen Francisco", "Merienda One", "Carrois Gothic SC", "Emilys Candy", "Oxygen Mono", "Noto Serif JP", "Allan", "Baloo Bhaina", "Herr Von Muellerhoff", "Andada", "Lemonada", "Do Hyeon", "Kelly Slab", "Capriola", "Andika", "Graduate", "Encode Sans", "Kristi", "Cutive Mono", "Bentham", "Sumana", "Montez", "Balthazar", "Amiko", "M PLUS Rounded 1c", "Averia Serif Libre", "Cambay", "Cormorant SC", "Maitree", "Yatra One", "Trocchi", "Mr De Haviland", "Oregano", "Life Savers", "Poly", "Wendy One", "Happy Monkey", "Megrim", "Federo", "Arizonia", "Trirong", "Sriracha", "Mirza", "Give You Glory", "Mate", "Fanwood Text", "Proza Libre", "Bowlby One", "Short Stack", "Aref Ruqaa", "Pompiere", "Baloo Tamma", "Baloo Paaji", "Quando", "IBM Plex Mono", "Gurajada", "Alike", "Ranga", "Suez One", "Rouge Script", "Lily Script One", "Cormorant Upright", "Seaweed Script", "Elsie", "Kadwa", "IM Fell DW Pica", "Nova Mono", "The Girl Next Door", "Qwigley", "Imprima", "Gabriela", "Aguafina Script", "Crafty Girls", "Laila", "Strait", "Baumans", "Rammetto One", "Mako", "Loved by the King", "IM Fell English", "Vast Shadow", "Rye", "Fondamento", "Sedgwick Ave", "Patrick Hand SC", "Cormorant Infant", "Convergence", "Wire One", "Expletus Sans", "Zeyada", "Lemon", "Gafata", "Faustina", "Harmattan", "Waiting for the Sunrise", "Podkova", "Oleo Script Swash Caps", "Just Me Again Down Here", "NTR", "Clicker Script", "Cherry Swash", "UnifrakturMaguntia", "Suranna", "Encode Sans Semi Condensed", "Prociono", "Euphoria Script", "Delius Swash Caps", "Dawning of a New Day", "Denk One", "David Libre", "La Belle Aurore", "Sansita", "Vesper Libre", "Fontdiner Swanky", "Brawler", "Walter Turncoat", "Sofia", "Voces", "Artifika", "Mukta Malar", "Athiti", "Wallpoet", "Metamorphous", "Stardos Stencil", "Meddon", "McLaren", "Belgrano", "Rakkas", "Sniglet", "Ledger", "Vibur", "Tienne", "Krona One", "Dekko", "Rubik Mono One", "Cantora One", "IM Fell English SC", "Orienta", "Sarpanch", "Mallanna", "Bilbo Swash Caps", "Mouse Memoirs", "Iceland", "Eater", "Codystar", "Salsa", "Vampiro One", "Share Tech", "Finger Paint", "Ramabhadra", "Nova Square", "Niramit", "Frijole", "Alike Angular", "Creepster", "Chonburi", "Fjord One", "Amita", "Uncial Antiqua", "Nova Round", "Katibeh", "Medula One", "Shanti", "Port Lligat Slab", "Londrina Outline", "Noto Serif KR", "Spirax", "Nosifer", "Holtwood One SC", "Over the Rainbow", "Habibi", "Mountains of Christmas", "Bellefair", "Englebert", "Headland One", "Bungee Shade", "Chau Philomene One", "Crushed", "Germania One", "Sura", "Averia Sans Libre", "Pavanam", "Poller One", "Warnes", "Dynalight", "Cherry Cream Soda", "Quintessential", "Bai Jamjuree", "Mandali", "Petrona", "Scope One", "Kranky", "Mate SC", "Kotta One", "Montserrat Subrayada", "Slackey", "Baloo Chettan", "Engagement", "Sail", "IBM Plex Sans Condensed", "Flamenco", "Ranchers", "Baloo Thambi", "League Script", "Rationale", "Mukta Mahee", "Fenix", "Cagliostro", "Tulpen One", "Milonga", "Overpass Mono", "Amarante", "Atma", "Numans", "Encode Sans Semi Expanded", "Geo", "Condiment", "Princess Sofia", "Mrs Saint Delafield", "Paprika", "Nova Slim", "Timmana", "Farsan", "Averia Libre", "Rosarivo", "Trade Winds", "Inknut Antiqua", "BioRhyme", "Encode Sans Expanded", "K2D", "Galada", "Jua", "Mogra", "Mystery Quest", "Battambang", "Chicle", "Simonetta", "Ruluko", "Spectral SC", "Mali", "Asul", "Antic Didone", "IM Fell French Canon", "Sarina", "Ruslan Display", "Delius Unicase", "Miniver", "Underdog", "Dorsa", "Stint Ultra Expanded", "Kosugi Maru", "Kite One", "Glass Antiqua", "Stint Ultra Condensed", "Chela One", "Stoke", "Maiden Orange", "Esteban", "Croissant One", "Averia Gruesa Libre", "Baloo Bhai", "Peralta", "Buda", "Bilbo", "Bubbler One", "Padauk", "Stalemate", "Fascinate Inline", "Swanky and Moo Moo", "Junge", "Pirata One", "Chakra Petch", "Arya", "Jim Nightshade", "Smythe", "Overlock SC", "Galindo", "Joti One", "Fresca", "Ribeye", "Sancreek", "IM Fell Great Primer", "Nova Flat", "Text Me One", "Almendra", "Manuale", "Coiny", "Port Lligat Sans", "Della Respira", "Meera Inimai", "Elsie Swash Caps", "Italiana", "Koulen", "Khmer", "Wellfleet", "Donegal One", "Redressed", "Sonsie One", "Marko One", "Lovers Quarrel", "Angkor", "Chango", "Inika", "Linden Hill", "Kavoon", "MedievalSharp", "Revalia", "Gugi", "Kumar One", "Unlock", "Autour One", "Diplomata SC", "Plaster", "Julee", "Offside", "Ramaraja", "Eagle Lake", "Ruthie", "Monofett", "IM Fell DW Pica SC", "UnifrakturCook", "Rhodium Libre", "Content", "Snippet", "Sree Krushnadevaraya", "Tillana", "Trykker", "Modak", "Akronim", "Mina", "Flavors", "Henny Penny", "Griffy", "Oldenburg", "Miltonian Tattoo", "Cormorant Unicase", "Irish Grover", "Ravi Prakash", "Poor Story", "Asset", "Baloo Tammudu", "Iceberg", "New Rocker", "Gaegu", "Galdeano", "Monsieur La Doulaise", "Purple Purse", "Rum Raisin", "Diplomata", "Barrio", "Metal Mania", "Margarine", "Jolly Lodger", "Lancelot", "Chathura", "Molle", "Keania One", "Snowburst One", "Sahitya", "Nokora", "IM Fell Great Primer SC", "Ewert", "Modern Antiqua", "Kosugi", "Asar", "Song Myung", "Siemreap", "Caesar Dressing", "Montaga", "Bahiana", "Federant", "Bigshot One", "Odor Mean Chey", "Ruge Boogie", "Ribeye Marrow", "Mrs Sheppards", "Arbutus", "Dr Sugiyama", "Felipa", "Bayon", "Original Surfer", "Devonshire", "Goblin One", "Zilla Slab Highlight", "Lakki Reddy", "Bungee Outline", "Bokor", "IM Fell French Canon SC", "Meie Script", "Macondo", "Jacques Francois Shadow", "KoHo", "Kavivanar", "Risque", "Krub", "Jomhuria", "Bigelow Rules", "Almendra Display", "Astloch", "Sunshiney", "Seymour One", "Dangrek", "IM Fell Double Pica SC", "Jacques Francois", "Kantumruy", "GFS Neohellenic", "Baloo Da", "Tenali Ramakrishna", "Moul", "Smokum", "Combo", "Trochut", "Vollkorn SC", "Freehand", "Kirang Haerang", "Piedra", "Almendra SC", "Atomic Age", "Londrina Shadow", "Kenia", "Nova Script", "Nova Oval", "Taprom", "Romanesco", "Sirin Stencil", "Suwannaphum", "Butterfly Kids", "Nova Cut", "Fruktur", "Kumar One Outline", "Sedgwick Ave Display", "Miltonian", "Geostar Fill", "Stalinist One", "Passero One", "Charmonman", "Peddana", "Bonbon", "Gorditas", "Metal", "Sofadi One", "Supermercado One", "East Sea Dokdo", "Libre Barcode 39 Extended Text", "Macondo Swash Caps", "Bungee Hairline", "Fascinate", "Aubrey", "Stylish", "Gidugu", "Butcherman", "Libre Barcode 128", "Cute Font", "Geostar", "Libre Barcode 39 Text", "Miss Fajardose", "Sevillana", "Yeon Sung", "Londrina Sketch", "Emblema One", "Mr Bedfort", "Erica One", "Preahvihear", "Gamja Flower", "Chenla", "Kodchasan", "Black And White Picture", "Suravaram", "Moulpali", "Fasthand", "Hi Melody", "Libre Barcode 39 Extended", "Dhurjati", "Kdam Thmor", "Hanalei", "Fahkwang", "BioRhyme Expanded", "Libre Barcode 39", "Srisakdi", "Notable", "Dokdo", "Libre Barcode 128 Text"]);
const all_theme_names = new Set(['bold', 'fluent', 'material']);

const get_user_profile_url = '';
const update_user_profile_url = '';

const update_success_msg = '';

const theme_pool_entrance_limit = 100;
const font_pool_entrance_limit = 10;

const random_items = (arr, num) => {
    return _.shuffle(arr).slice(0, num+1);
};

class FontPool extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showListclicked: false,
            is_1_clicked: false,
            is_10_clicked: false
        };
    }

    getCurrentPool() {
        let existing_items = new Set(this.props.existing_items);
        return all_font_names.filter(item => !existing_items.has(item));
    }

    handleButtonClick(is_1) {
        let current_balance = this.props.balance;
        if (is_1 && current_balance < font_pool_entrance_limit) {
            return;
        }
        if (!is_1 && current_balance < font_pool_entrance_limit*10) {
            return;
        }
        let items = [];
        if (is_1) {
            items = random_items(this.getCurrentPool(), 1);
            this.setState({is_1_clicked: true, is_10_clicked: false, items_chosen: items});
            this.props.updating_storage(items, current_balance-font_pool_entrance_limit);
        } else {
            items = random_items(this.getCurrentPool(), 10);
            this.setState({is_1_clicked: false, is_10_clicked: true, items_chosen: items});
            this.props.updating_storage(items, current_balance-font_pool_entrance_limit*10);
        }

    }

    render() {

        let display_arr = this.getCurrentPool().map(item => <li><span>{item}</span></li>);

        let random_arr = this.state.items_chosen.map(item => <li><span>{item}</span></li>);
        return (
            <div>
                <button onClick={() => this.setState({showListclicked: !this.state.showListclicked})}>Show List</button>
                {
                    this.state.showListclicked ? (<section><ul>{display_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(true)}>*1</button>
                {
                    this.state.is_1_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(false)}>*10</button>
                {
                    this.state.is_10_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
            </div>
        );
    }
}

class ThemePool extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showListclicked: false,
            is_1_clicked: false,
            is_10_clicked: false
        };
    }

    getCurrentPool() {
        let existing_items = new Set(this.props.existing_items);
        return all_theme_names.filter(item => !existing_items.has(item));
    }

    handleButtonClick(is_1) {
        let current_balance = this.props.balance;
        if (is_1 && current_balance < theme_pool_entrance_limit) {
            return;
        }
        if (!is_1 && current_balance < theme_pool_entrance_limit*10) {
            return;
        }
        let items = [];
        if (is_1) {
            items = random_items(this.getCurrentPool(), 1);
            this.setState({is_1_clicked: true, is_10_clicked: false, items_chosen: items});
            this.props.updating_storage(items, current_balance-theme_pool_entrance_limit);
        } else {
            items = random_items(this.getCurrentPool(), 10);
            this.setState({is_1_clicked: false, is_10_clicked: true, items_chosen: items});
            this.props.updating_storage(items, current_balance-theme_pool_entrance_limit*10);
        }

    }

    render() {
        let current_balance = this.props.balance;
        if (current_balance < theme_pool_entrance_limit) {
            return (<section><h3>Your balance is not enough for theme pool!</h3></section>);
        }
        let display_arr = this.getCurrentPool().map(item => <li><span>{item}</span></li>);

        let random_arr = this.state.items_chosen.map(item => <li><span>{item}</span></li>);
        return (
            <div>
                <button onClick={() => this.setState({showListclicked: !this.state.showListclicked})}>Show List</button>
                {
                    this.state.showListclicked ? (<section><ul>{display_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(true)}>*1</button>
                {
                    this.state.is_1_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
                <button onClick={() => this.handleButtonClick(false)}>*10</button>
                {
                    this.state.is_10_clicked ? (<section><h4>Congratuations! You have unlocked</h4><ul>{random_arr}</ul></section>) : (null)
                }
            </div>
        );
    }
}

class EBucksDisplay extends Component {
    render() {
        return (
            <section>
                <h3>Your current balance is:</h3>
                <div>{this.props.balance}</div>
            </section>
        )
    }
}

export class RoulettePanel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            existing_items: []
        };
    }
    componentDidMount() {
        let user = this.props.user;
        axios.get(get_user_profile_url, {
            params: {
                // TODO: params
            }
        }).then((response) => {
            this.setState({balance: response.data.eBucks, existing_items: response.data.items});
        })
    }
    
    updateStorage(newItem, newBalance) {
        let user = this.props.user;
        axios.post(update_user_profile_url, {
            // TODO: params
        }).then((response) => {
            if (response.data === update_success_msg) {
                let prev_items = this.state.existing_items.slice();
                prev_items.push(newItem);
                this.setState({existing_items: prev_items, balance: newBalance});
            }
        });
    }

    render() {
        let balance = this.state.balance;
        if (balance < font_pool_entrance_limit) {
            return (
                <section><h3>Your balance is not enough!</h3></section>
            );
        }
        return (
            <div>
                <EBucksDisplay balance={balance}/>
                <FontPool balance={balance} existing_items={this.state.existing_items} updating_storage={(newItem, newBalance) => this.updateStorage(newItem, newBalance)}/>
                <ThemePool balance={balance} existing_items={this.state.existing_items} updating_storage={(newItem, newBalance) => this.updateStorage(newItem, newBalance)}/>
            </div>
        );
    }
}