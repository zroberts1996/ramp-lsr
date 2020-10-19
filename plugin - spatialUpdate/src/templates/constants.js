export const PROVINCE_NAME = {
    'fr-CA' : {
        'Canada': 'CA',
        'Alberta': 'AB',
        'Colombie-Britannique': 'BC',
        'Île-du-Prince-Édouard': 'PE',
        'Manitoba': 'MB',
        'Nouveau-Brunswick': 'NB',
        'Nouvelle-Écosse': 'NS',
        'Nunavut': 'NU',
        'Ontario': 'ON',
        'Québec': 'QC',
        'Saskatchewan': 'SK',
        'Terre-Neuve-et-Labrador': 'NL',
        'Territoire du Nord-Ouest': 'NT',
        'Yukon': 'YT'
    },
    'en-CA': {
        'Canada': 'CA',
        'Alberta': 'AB',
        'British-Colombia': 'BC',
        'Prince Edward Island': 'PE',
        'Manitoba': 'MB',
        'New Brunswick': 'NB',
        'Newfoundland and Labrador': 'NL',
        'Northwest Territories': 'NT',
        'Nova Scotia': 'NS',
        'Nunavut': 'NU',
        'Ontario': 'ON',
        'Quebec': 'QC',
        'Saskatchewan': 'SK',
        'Yukon': 'YT'
    }    
}

export const SEARCH_OPTIONS = {
    'fr-CA' : [
        ['protected', 'parcel', 'Aire protégée'], 
        ['project', 'project', 'Arpentage en cours'],
        ['community', 'admin', 'Communauté'],
        ['cree', 'admin', 'Cri-Naskapi'],
        ['municipal', 'admin', 'Limite municipale'],
        ['subdivision', 'subdivision', 'Lotissement'],
        ['park', 'admin', 'Parc national'],
        ['parcel', 'parcel', 'Parcelle'],
        ['plan', 'plan', "Plan d'arpentage"],
        ['quad', 'quad', 'Quadrilatère'],
        ['reserve', 'admin', 'Réserve indienne'],
        ['town', 'town', 'Township'], 
        ['coords', 'parcel', 'Coordonnées'],
    ],
    'en-CA': [
        ['community', 'admin', 'Community'],
        ['cree', 'admin', 'Cree-Naskapi'],
        ['reserve', 'admin', 'Indian Reserve'], 
        ['municipal', 'admin', 'Municipal Boundary'],
        ['park', 'admin', 'National Park'],
        ['parcel', 'parcel', 'Parcel'],
        ['protected', 'parcel', 'Protected Area'],
        ['quad', 'quad', 'Quad'],
        ['subdivision', 'subdivision', 'Subdivision'],
        ['plan', 'plan', 'Survey Plan'],
        ['project', 'project', 'Survey in Progress'],
        ['town', 'town', 'Township'],
        ['coords', 'parcel', 'Coordinates'],
    ]
}

export const PROXY_FIELDS = {
    community: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
    reserve: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
    plan: ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"],
    project: ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"],
    parcel: ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"],
    park: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
    cree: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
    municipal: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
}
    
export const SEARCH_LAYERS = {
    "community": 2,
    "cree": 14,
    "municipal": 4,
    "plan": 0,
    "reserve": 3,
    "protected": 7,
    "project": 9,
    "parcel": 1,
    "park": 5,
}
