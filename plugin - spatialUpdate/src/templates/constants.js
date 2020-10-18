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
        ['protected', 'Aire protégée'], 
        ['project', 'Arpentage en cours'],
        ['community', 'Communauté'],
        ['cree', 'Cri-Naskapi'],
        ['municipal', 'Limite municipale'],
        ['subdivision', 'Lotissement'],
        ['park', 'Parc national'],
        ['parcel', 'Parcelle'],
        ['plan', "Plan d'arpentage"],
        ['quad', 'Quadrilatère'],
        ['reserve', 'Réserve indienne'],
        ['town', 'Township'], 
        ['coords', 'Coordonnées'],
    ],
    'en-CA': [
        ['community', 'Community'],
        ['cree', 'Cree-Naskapi'],
        ['reserve', 'Indian Reserve'], 
        ['municipal', 'Municipal Boundary'],
        ['park', 'National Park'],
        ['parcel', 'Parcel'],
        ['protected', 'Protected Area'],
        ['quad', 'Quad'],
        ['subdivision', 'Subdivision'],
        ['plan', 'Survey Plan'],
        ['project', 'Survey in Progress'],
        ['town', 'Township'],
        ['coords', 'Coordinates'],
    ]
}

export const PROXY_FIELDS = {
    reserve: ["ENGLISHNAME", "ADMINAREAID", "FRENCHNAME", "PROVINCE", "GlobalID"],
    plan: ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"],
    project: ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"],
    parcel: ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"],
}
    
export const SEARCH_LAYERS = {
    "plan": 0,
    "reserve": 3,
    "protected": 7,
    "project": 9,
    "parcel": 1,
}
