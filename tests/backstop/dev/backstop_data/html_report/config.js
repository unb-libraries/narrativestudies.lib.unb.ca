report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../bitmaps_reference/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_0_phone.png",
        "test": "../bitmaps_test/20180417-194926/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_0_phone.png",
        "selector": "document",
        "fileName": "narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_0_phone.png",
        "label": "dev-narrativestudies.lib.unb.ca Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00",
          "getDiffImage": null
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "../bitmaps_reference/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_1_tablet.png",
        "test": "../bitmaps_test/20180417-194926/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_1_tablet.png",
        "label": "dev-narrativestudies.lib.unb.ca Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": 0,
            "height": -10
          },
          "misMatchPercentage": "9.85",
          "analysisTime": 158,
          "getDiffImage": null
        },
        "diffImage": "../bitmaps_test/20180417-194926/failed_diff_narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_1_tablet.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "../bitmaps_reference/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_2_monitor.png",
        "test": "../bitmaps_test/20180417-194926/narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_2_monitor.png",
        "selector": "document",
        "fileName": "narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_2_monitor.png",
        "label": "dev-narrativestudies.lib.unb.ca Homepage",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": 0,
            "height": -10
          },
          "misMatchPercentage": "5.33",
          "analysisTime": 380,
          "getDiffImage": null
        },
        "diffImage": "../bitmaps_test/20180417-194926/failed_diff_narrativestudies_lib_unb_ca_dev-narrativestudieslibunbca_Homepage_0_document_2_monitor.png"
      },
      "status": "fail"
    }
  ]
});